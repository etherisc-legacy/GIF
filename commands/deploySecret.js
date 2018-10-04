const { Command } = require('@oclif/command');
const fs = require('fs');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const { spawnSync } = require('child_process');

/**
 * Deploy secrets command
 */
class DeploySecret extends Command {
  /**
   * Generate and deploy secrets to GKE
   * @return {Promise<void>}
   */
  async run() {
    const filename = `k8s.${process.argv[3]}.yaml`;
    const doc = yaml.safeLoad(fs.readFileSync(`./services/secrets/${filename}`, 'utf8'));
    const questions = Object.keys(doc.data).map(name => ({
      name,
      type: 'input',
      message: name,
      default: Buffer.from(doc.data[name], 'base64').toString('utf-8'),
    }));
    const answers = await inquirer.prompt(questions);
    doc.data = Object.keys(answers).reduce((data, name) => Object.assign(data, { [name]: Buffer.from(answers[name]).toString('base64') }), {});
    const secret = yaml.safeDump(doc);
    fs.writeFileSync(`./${filename}`, secret);
    spawnSync('kubectl', ['apply', '-f', `./${filename}`], { stdio: 'inherit' });
    fs.unlinkSync(`./${filename}`);
  }
}

DeploySecret.description = 'Deploy secrets';

module.exports = DeploySecret;
