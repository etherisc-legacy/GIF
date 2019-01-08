const fs = require('fs');
const path = require('path');

/**
 * Version service
 */
class VersionService {
  /**
   * constructor
   * @param {*} param0
   */
  constructor({ contractResolver }) {
    this.contractResolver = contractResolver;
  }

  /**
   * Retrieve app version
   * @return {{}}
   */
  async retrieveAppVersion() {
    let appVersion;

    try {
      const appVersionJson = await this.loadVersionFrom('./../version.json');

      appVersion = JSON.parse(appVersionJson).version;
    } catch (error) {
      appVersion = 'Not Specified';
    }

    const contractsVersion = (await this.contractResolver.getContractsVersion()) || 'Not Specified';
    return { appVersion, contractsVersion };
  }

  /**
   * Load version from file
   * @param {*} fileName
   * @return {Promise<string>}
   */
  async loadVersionFrom(fileName) {
    const fullPath = path.join(__dirname, fileName);

    return new Promise((resolve, reject) => {
      fs.readFile(fullPath, 'utf8', (err, data) => !err ? resolve(data) : reject(err));
    });
  }
}

module.exports = VersionService;
