const emailValidator = require('email-validator');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * Register command
 */
class Login extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    // Email
    const email = await this.cli.prompt('Email');
    if (!emailValidator.validate(email)) {
      this.error(this.errorMessages.invalidEmail);
    }

    // Password
    const password = await this.cli.prompt('Password', { type: 'hide' });

    const response = await this.api.login(email, password)
      .catch((error) => {
        this.log(JSON.stringify(error.response.data));
        this.error(error.message);
      });

    const config = {
      user: {
        id: response.data.id,
        token: response.data.token,
      },
      products: response.data.products,
    };

    this.globalConfig.configure(config);

    this.log('User logged in');
  }
}

Login.description = `Log into in GIF
...
Log into GIF
`;

module.exports = Login;
