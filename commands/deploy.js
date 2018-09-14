const { Command } = require('@oclif/command');
const { Client, config } = require('kubernetes-client');
const glob = require('fast-glob');
const fs = require('fs');
const { exec } = require('child_process');


class Deploy extends Command {
  async run() {
    this.client = new Client({ config: config.fromKubeconfig(), version: '1.10' });

    const files = await glob(['**/k8s.*.yaml', '!**/node_modules/**']);

    let configuration = '';
    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      configuration += `---\n${content}`;
    });

    fs.writeFileSync('./compose.yaml', configuration);

    const deploy = await new Promise((resolve, reject) => {
      exec(`kubectl apply -f ${process.cwd()}/compose.yaml`, (err, stdout, stderr) => {
        if (err || stderr) {
          reject(new Error(err || stderr));
        } else {
          resolve(stdout);
        }
      });
    });

    console.log(deploy);
  }
}

Deploy.description = 'Deploy microservices to Kubernetes';

module.exports = Deploy;
