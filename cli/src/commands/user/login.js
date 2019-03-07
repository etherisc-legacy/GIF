const { Command } = require('@oclif/command');
const { cli } = require('cli-ux');

/**
 * Login command
 */
class Login extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const email = await cli.prompt('Email');
    const password = await cli.prompt('Password', { type: 'hide' });

    this.log(`Login with: ${email}, ${password}`);
  }
}

Login.description = `Login to GIF
...
Login to GIF
`;

module.exports = Login;
