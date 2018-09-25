const { Command } = require('@oclif/command');
const { EOL } = require('os');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const glob = require('fast-glob');
const yaml = require('js-yaml');
const uuid = require('uuid/v1');


const PROD = process.env.NODE_ENV === 'production';

/**
 * Deploy to k8s command
 */
class Deploy extends Command {
  /**
   * Promisified exec
   * @param {string} cmd
   * @return {Promise}
   */
  execute(cmd) {
    return new Promise((resolve, reject) => {
      this.log.info(`Run: ${cmd}`);

      const sh = exec(cmd, (err, stdout, stderr) => {
        if (err) {
          const error = new Error(err);
          error.stdout = stdout;
          error.stderr = stderr;

          this.log.info(stdout);
          reject(err);
          return;
        }

        resolve({ stdout, stderr });
      });

      sh.stdout.on('data', this.log.info);
    });
  }

  /**
   * Run deploy command
   * @return {Promise<void>}
   */
  async run() {
    if (PROD && !process.env.GCLOUD_CLUSTER) throw new Error('GKE cluster should be specified');
    if (PROD && !process.env.GCLOUD_PROJECT) throw new Error('GKE project should be specified');
    if (PROD && !process.env.GCLOUD_ZONE) throw new Error('GKE zone should be specified');

    this.log = {
      info: console.log, // eslint-disable-line
    };

    const patterns = [
      '**/k8s*.yaml',
      '!**/node_modules/**',
      PROD && '!**/secrets/**',
    ].filter(Boolean);

    const files = await glob(patterns);

    const entities = {};

    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');

      const list = yaml.safeLoadAll(fileContent);

      list.forEach((element) => {
        if (!entities[element.kind]) entities[element.kind] = [];

        const entity = {};

        const filePathParts = file.split('/');

        if (/<!--image-->/.test(JSON.stringify(element))) {
          const dockerfilePath = path.join(...filePathParts.slice(0, -2));
          const packageJsonfile = path.join(...filePathParts.slice(0, -2), 'package.json');

          const packageJson = require(path.join(process.cwd(), packageJsonfile));

          let imageName;
          if (process.env.NODE_ENV !== 'production') {
            imageName = `${packageJson.name}:${uuid()}`;
          } else {
            const commitHash = execSync('git rev-parse HEAD').toString().trim();
            imageName = `gcr.io/${process.env.GCLOUD_PROJECT}/${packageJson.name}:${commitHash}`;
          }

          entity.dockerfilePath = path.join(process.cwd(), dockerfilePath);
          entity.imageName = imageName;
          entity.name = packageJson.name;
          entity.version = packageJson.version;
          entity.config = JSON.parse(JSON.stringify(element).replace('<!--image-->', imageName));
          entity.config.metadata.labels.version = packageJson.version;
        } else {
          entity.config = element;
        }

        entities[element.kind].push(entity);
      });
    });


    if (process.env.NODE_ENV === 'production') {
      await this.execute(`kubectl config use-context gke_${process.env.GCLOUD_PROJECT}_${process.env.GCLOUD_ZONE}_${process.env.GCLOUD_CLUSTER}`);

      try {
        await this.execute('kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)');
      } catch (e) {
        this.log.info('cluster-admin-binding already exists');
      }
    } else {
      await this.execute('kubectl config use-context minikube');
      await this.execute('minikube addons enable ingress');
    }

    const groups = Object.keys(entities);

    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i];

      this.log.info(`${EOL}${i + 1}. ${group}`);

      for (let j = 0; j < entities[group].length; j += 1) {
        const element = entities[group][j];

        this.log.info(`${EOL}Apply ${group} ${element.config.metadata.name}`);

        if (element.dockerfilePath) {
          this.log.info(`Start Docker build for ${element.imageName}`);

          if (PROD) {
            await this.execute(`cd ${element.dockerfilePath}; docker build -t ${element.imageName} .`);

            this.log.info('Push image to GCR');
            await this.execute(`docker push ${element.imageName}`);
          } else {
            await this.execute(`eval $(minikube docker-env); cd ${element.dockerfilePath}; docker build -t ${element.imageName} .`);
          }
        }

        const file = path.join(process.cwd(), `tempfile-${group}-${element.config.metadata.name}.yaml`);

        fs.writeFileSync(file, yaml.safeDump(element.config));
        await this.execute(`kubectl apply -f ${file}`);
        fs.unlinkSync(file);
      }
    }
  }
}

Deploy.description = 'Deploy to Kubernetes cluster command';

module.exports = Deploy;
