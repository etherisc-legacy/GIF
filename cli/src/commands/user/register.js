const { Command } = require('@oclif/command');
const { cli } = require('cli-ux');
const os = require('os');
const PasswordValidator = require('password-validator');
const emailValidator = require('email-validator');
const fs = require('fs-jetpack');

/**
 * Register command
 */
class Register extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const email = await cli.prompt('Email');
    const firstname = await cli.prompt('Firstname');
    const lastname = await cli.prompt('Lastname');
    const password = await cli.prompt('Password', { type: 'hide' });
    const passwordRepeat = await cli.prompt('Repeat password', { type: 'hide' });

    if (password !== passwordRepeat) {
      //
    }

    const passwordSchema = new PasswordValidator();
    passwordSchema
      .is().min(8)
      .is().max(20)
      .has().uppercase() // eslint-disable-line
      .has().lowercase() // eslint-disable-line
      .has().digits() // eslint-disable-line
      .has().not().spaces() // eslint-disable-line
      .is().not().oneOf(['Passw0rd', 'Password123']); // eslint-disable-line

    if (!passwordSchema.validate(password)) {
      //
    }

    if (!emailValidator.validate(email)) {
      //
    }

    if (!firstname.length) {
      //
    }

    if (!lastname.length) {
      //
    }

    const config = {};

    fs.write(`${os.homedir()}/.gifconfig.json`, JSON.stringify(config));

    this.log('\nRegistration succeed');
  }
}

Register.description = `Register in GIF
...
Register in GIF
`;

module.exports = Register;
