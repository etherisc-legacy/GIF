const BaseCommand = require('../../lib/BaseCommand');
const GlobalConfig = require('../../lib/GlobalConfig');

/**
 * Login command
 */
class Profile extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    this.globalConfig = new GlobalConfig();
    if (!this.globalConfig.user || !this.globalConfig.user.id) {
      this.error('User not logged in. Please login.');
      return;
    }
    await this.api.profile(this.globalConfig.user.id)
      .catch((error) => {
        if (error.response && error.response.data) {
          this.log(JSON.stringify(error.response.data));
        }
        this.error(error.message);
      });
  }
}

Profile.description = `Get user profile
...
Log into GIF
`;

module.exports = Profile;
