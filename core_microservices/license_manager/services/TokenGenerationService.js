const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');


const TOKEN_EXPIRATION_MINUTES = process.env.JWT_TOKEN_EXPIRATION_MINUTES || 360;

/**
 * JWT token generation service
 */
class TokenGenerationService {
  /**
     * constructor
     * @param {{}} dependencies
     */
  constructor(dependencies) {
    this.secret = dependencies.config.jwt_secret;
    this.log = dependencies.log;
  }

  /**
     * Generate token
     * @param {{}} userData
     * @return {string} token
     */
  generateToken(userData) {
    // filter possible userData
    const { id, email, updated } = userData;

    const dataToPackage = {
      data: { id, email, updated },
      exp: this.constructor.tokenExpirationTime(),
    };

    return jsonwebtoken.sign(dataToPackage, this.secret);
  }

  /**
    * Generate an expiration time for token that is created now
    * @return {integer} unix timestamp
    */
  static tokenExpirationTime() {
    return moment().add(TOKEN_EXPIRATION_MINUTES, 'minutes').unix();
    // return (Math.floor(Date.now() / 1000) - (TOKEN_EXPIRATION_MINUTES * 60));
  }
}

module.exports = TokenGenerationService;
