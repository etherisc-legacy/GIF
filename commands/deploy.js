const { Command } = require('@oclif/command');
const { EOL } = require('os');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const glob = require('fast-glob');
const yaml = require('js-yaml');
const crypto = require('crypto');
const moment = require('moment');
const inquirer = require('inquirer');


const DESTINATION = process.env.DEPLOY_DESTINATION;
const PROD = DESTINATION === 'gke';

const imageRegex = /<!--image-->/;

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
    this.log = {
      info: console.log, // eslint-disable-line
    };

    this.constructor.checkEnvironmentVariables();

    this.timestamp('START CONFIGURATION');
    await this.configureDeploy();
    this.timestamp('FINISHED CONFIGURATION');

    this.optionsPrompt = await inquirer.prompt([
      {
        type: 'confirm', name: 'setSecrets', message: 'Set Secret variables? (default: N)', default: false,
      },
      {
        type: 'confirm', name: 'keepConfigs', message: 'Keep config files for debug? (default: N)', default: false,
      },
    ]);

    const entities = await this.collectConfigurationFiles();

    await this.buildConfigMaps();

    this.timestamp('START DEPLOYMENT');
    await this.deploy(entities);
    this.timestamp('FINISHED DEPLOYMENT');
  }

  /**
   * Log with a timestamp
   * @param {string} message
   * @return {undefined}
   */
  timestamp(message) {
    this.log.info(`==== ${moment().format('LTS')} - ${message}`);
  }

  /**
   * Check presense of the required ENV variables
   * @return {undefined}
   */
  static checkEnvironmentVariables() {
    if (!process.env.NPM_TOKEN) throw new Error('NPM token should be specified (NPM_TOKEN)');
    if (PROD) {
      if (!process.env.GCLOUD_CLUSTER) throw new Error('GKE cluster should be specified (GCLOUD_CLUSTER)');
      if (!process.env.GCLOUD_PROJECT_ID) throw new Error('GKE project id should be specified (GCLOUD_PROJECT_ID)');
      if (!process.env.GCLOUD_ZONE) throw new Error('GKE zone should be specified (GCLOUD_ZONE)');
    }
  }

  /**
   * Collect configuration files into an object
   * @return {Promise<Object>}
   */
  async collectConfigurationFiles() {
    const patterns = [
      '**/k8s*.yaml',
      '!**/node_modules/**',
    ];

    if (PROD) {
      patterns.push('!**/k8s/ganache/**');
    }

    const files = await glob(patterns);

    const entities = {};

    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');
      const list = yaml.safeLoadAll(fileContent);

      list.forEach((listElement) => {
        let element = listElement;
        const entity = {};

        if (imageRegex.test(JSON.stringify(element))) {
          const filePathParts = file.split('/');

          const dockerfilePath = path.join(...filePathParts.slice(0, -2));
          const packageJsonfile = path.join(...filePathParts.slice(0, -2), 'package.json');

          const { name, version } = require(path.join(process.cwd(), packageJsonfile));

          entity.name = name.replace(/[^a-zA-Z]+/, '');
          entity.version = version;
          entity.dockerfilePath = path.join(process.cwd(), dockerfilePath);

          const folderHash = this.constructor.hashFolderState(entity.dockerfilePath);

          if (!PROD) {
            entity.imageName = `${entity.name}:${folderHash}`;
          } else {
            entity.imageName = `gcr.io/${process.env.GCLOUD_PROJECT_ID}/${entity.name}:${folderHash}`;
          }

          [element] = yaml.safeLoadAll(yaml.safeDump(element).replace(imageRegex, entity.imageName));

          element.metadata.labels.version = version;
        }

        entity.config = element;

        if (!entities[element.kind]) entities[element.kind] = [];
        entities[element.kind].push(entity);
      });
    });

    return entities;
  }

  /**
   * Init ConfigMaps from 'configurations' folder
   * @return {Promise<Object>}
   */
  async buildConfigMaps() {
    const configurationsFolerPath = path.join(process.cwd(), 'services/configurations');
    const configFolderNames = fs.readdirSync(configurationsFolerPath);

    for (let index = 0; index < configFolderNames.length; index += 1) {
      const folderName = configFolderNames[index];
      const fullFolderName = path.join(configurationsFolerPath, folderName);
      await this.execute(`kubectl delete configmap ${folderName}-config --ignore-not-found=true`);
      await this.execute(`kubectl create configmap ${folderName}-config --from-file=${fullFolderName}`);
    }
  }

  /**
   * Set kubectl context depending on the deploy destination
   * @return {Promise<undefined>}
   */
  async configureDeploy() {
    switch (DESTINATION) {
      case 'gke':
        await this.configureK8sDeploy();
        break;
      case 'minikube':
        await this.configureMinikubeDeploy();
        break;
      case 'docker':
        await this.configureDockerDeploy();
        break;
      default:
        throw new Error('Acceptable DEPLOY_DESTINATION values are: gke, minikube, docker');
    }
  }

  /**
   * Set kubectl context to GKE
   * @return {Promise<undefined>}
   */
  async configureK8sDeploy() {
    await this.execute(`kubectl config use-context gke_${process.env.GCLOUD_PROJECT_ID}_${process.env.GCLOUD_ZONE}_${process.env.GCLOUD_CLUSTER}`);
    await this.execute(`gcloud config set project ${process.env.GCLOUD_PROJECT_ID}`);

    try {
      await this.execute('kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)');
    } catch (e) {
      this.log.info('cluster-admin-binding already exists');
    }

    try {
      await this.execute('gcloud compute firewall-rules create minio --allow tcp:30009');
    } catch (e) {
      this.log.info('firewall-rule minio already exists');
    }

    try {
      await this.execute('gcloud compute firewall-rules create ganache --allow tcp:30045');
    } catch (e) {
      this.log.info('firewall-rule ganache already exists');
    }

    try {
      await this.execute('gcloud compute firewall-rules create pg --allow tcp:30032');
    } catch (e) {
      this.log.info('firewall rule pg already exists');
    }

    try {
      await this.execute('gcloud compute firewall-rules create rabbitmq --allow tcp:30672');
    } catch (e) {
      this.log.info('firewall rule rabbitmq already exists');
    }
  }

  /**
   * Set kubectl context to Minikube local
   * @return {Promise<undefined>}
   */
  async configureMinikubeDeploy() {
    await this.execute('kubectl config use-context minikube');
    await this.execute('minikube addons enable ingress');
    await this.execute('echo "sudo mkdir /data/minio; sudo ln -s /data/minio /var/minio; exit" | minikube ssh');
    await this.execute('echo "sudo mkdir /data/ganache; sudo ln -s /data/ganache /var/ganache; exit" | minikube ssh');
  }

  /**
   * Set kubectl context to standalone Kubernetes deploying with local Docker
   * @return {Promise<undefined>}
   */
  async configureDockerDeploy() {
    await this.execute('kubectl config use-context docker-for-desktop');
  }

  /**
   * Run deploy scripts
   * @param {Object} entities
   * @return {Promise<undefined>}
   */
  async deploy(entities) {
    const groupPriority = [
      'Role', 'RoleBinding', 'ConfigMap', 'Secret',
      'PersistentVolume', 'PersistentVolumeClaim',
      'ServiceAccount', 'Service',
      'StatefuleSet', 'Deployment',
      'Job',
    ];
    const groups = Object.keys(entities);
    groups.sort((first, second) => groupPriority.indexOf(first) - groupPriority.indexOf(second));

    await this.execute('mkdir -p temp/deploy');

    for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
      const group = groups[groupIndex];

      this.log.info(`${EOL}${groupIndex + 1}. ${group}`);

      for (let entityIndex = 0; entityIndex < entities[group].length; entityIndex += 1) {
        const entity = entities[group][entityIndex];

        if (group === 'Secret') {
          entity.config = await this.promptSecrets(entity.config);
        }

        if (entity.config) {
          this.log.info(`${EOL}Apply ${group} ${entity.config.metadata.name}`);

          if (entity.dockerfilePath) { await this.packageDockerContainer(entity); }

          const file = path.join(process.cwd(), `temp/deploy/${group}-${entity.config.metadata.name}.yaml`);

          fs.writeFileSync(file, yaml.safeDump(entity.config));

          if (group === 'Job') await this.execute(`kubectl delete -f ${file} --ignore-not-found=true`);

          this.timestamp(`Start Application of ${file}`);

          await this.execute(`kubectl apply -f ${file}`);

          this.timestamp(`Finished Application of ${file}`);
          if (!this.optionsPrompt.keepConfigs) { fs.unlinkSync(file); }
        }
      }
    }
  }

  /**
   * Modify default secret storage values for deployment
   * @param {Object} entityConfig
   * @return {Object}
   */
  async promptSecrets(entityConfig) {
    let modifiedSecrets = entityConfig;
    const { setSecrets } = this.optionsPrompt;
    const defaultUpdate = !PROD;

    const options = setSecrets && await inquirer.prompt([
      {
        type: 'confirm',
        name: 'update',
        message: `Update ${entityConfig.metadata.name} values? (default: ${defaultUpdate ? 'Y' : 'N'})`,
        default: defaultUpdate,
      },
    ]);

    if (setSecrets && options.update) {
      const questions = Object.keys(entityConfig.data).map(name => ({
        name,
        type: 'input',
        message: name,
        default: process.env[name] || Buffer.from(entityConfig.data[name], 'base64').toString('utf-8'),
      }));
      const answers = await inquirer.prompt(questions);
      modifiedSecrets.data = Object.keys(answers).reduce((data, name) => Object.assign(data, { [name]: Buffer.from(answers[name]).toString('base64') }), {});
    } else {
      modifiedSecrets = null;
    }

    return modifiedSecrets;
  }

  /**
   * Read configuration element to find and execute docker build instructions
   * @param {Object} element
   * @return {Promise<void>}
   */
  async packageDockerContainer(element) {
    // TODO: Skip packaging if container exists
    this.timestamp(`Start Docker build for ${element.imageName}`);

    if (DESTINATION === 'minikube') {
      await this.execute('eval $(minikube docker-env);');
    }

    try {
      await this.execute(
        `docker inspect --format='Last build time: {{.Metadata.LastTagTime}}' --type=image ${element.imageName}`,
      );
    } catch (error) {
      this.log.info('Error on image detection; building a new one');
      await this.execute(
        `cd ${element.dockerfilePath}; 
         docker build --build-arg NPM_TOKEN=${process.env.NPM_TOKEN} -t ${element.imageName} .`,
      );
    }

    if (DESTINATION === 'gke') {
      this.log.info('Push image to GCR');
      await this.execute(`docker push ${element.imageName}`);
    }

    this.timestamp(`Finished Docker build for ${element.imageName}`);
  }

  /**
   * Hash the git state of dockerized folder to ensure new container is built in development for local changes
   * @param {string} dockerFilePath
   * @return {string}
   */
  static hashFolderState(dockerFilePath) {
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    const localDiff = execSync(`git diff ${dockerFilePath}`).toString().trim();

    return `${commitHash}${crypto.createHash('md5').update(localDiff).digest('hex')}`;
  }
}

Deploy.description = 'Deploy to Kubernetes cluster command';

module.exports = Deploy;
