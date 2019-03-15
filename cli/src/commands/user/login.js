const BaseCommand = require('../../lib/BaseCommand');

/**
 * Login command
 */
class Login extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const email = await this.cli.prompt('Email');
    const password = await this.cli.prompt('Password', { type: 'hide' });

    // E.g. response:
    // const response = {
    //   data: {
    //     id : 1,
    //     token: 'c3FIOG9vSGV4VHo4QzAyg5T1JvNnJoZ3ExaVNyQWw6WjRsanRKZG5lQk9qUE1BVQ',
    //   },
    // };
    const response = await this.api.login(email, password);

    const config = {
      user: response.data,
    };

    this.configure(config);

    this.log('\nLogged in');
  }
}

Login.description = `Login to GIF
...
Login to GIF
`;

module.exports = Login;
