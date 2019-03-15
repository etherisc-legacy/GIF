const PasswordValidator = require('password-validator');
const emailValidator = require('email-validator');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * Register command
 */
class Register extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    // Firstname
    const firstname = await this.cli.prompt('Firstname');
    if (!firstname.length) throw new Error('Firstname not provided');

    // Lastname
    const lastname = await this.cli.prompt('Lastname');
    if (!lastname.length) throw new Error('Lastname not provided');

    // Email
    const email = await this.cli.prompt('Email');
    if (!emailValidator.validate(email)) throw new Error('Email is invalid');

    // Password
    const password = await this.cli.prompt('Password', { type: 'hide' });
    const passwordSchema = new PasswordValidator();
    passwordSchema
      .is().min(8)
      .is().max(20)
      .has().uppercase() // eslint-disable-line
      .has().lowercase() // eslint-disable-line
      .has().digits() // eslint-disable-line
      .has().not().spaces(); // eslint-disable-line

    // if (!passwordSchema.validate(password)) throw new Error('Password is invalid');

    // Repeat password
    const passwordRepeat = await this.cli.prompt('Repeat password', { type: 'hide' });
    if (password !== passwordRepeat) throw new Error('Passwords are not equal');

    // E.g. response:
    // const response = {
    //   data: {
    //     id : 1,
    //     token: 'c3FIOG9vSGV4VHo4QzAyg5T1JvNnJoZ3ExaVNyQWw6WjRsanRKZG5lQk9qUE1BVQ',
    //   },
    // };

    const response = await this.api.register(firstname, lastname, email, password);

    const config = {
      user: {
        id: response.data.id,
        token: response.data.token,
      },
    };

    this.configure(config);

    this.log('User registered');
  }
}

Register.description = `Register in GIF
...
Register in GIF
`;

module.exports = Register;
