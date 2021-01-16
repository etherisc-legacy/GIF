const RabbitAPIService = require('./RabbitAPIService');
const TokenGenerationService = require('./TokenGenerationService');
const GIF = require('./Gif');


module.exports = (dependencies) => {
  const rabbitAPIService = new RabbitAPIService({ ...dependencies });
  const tokenGenerationService = new TokenGenerationService({ ...dependencies });
  const gifService = new GIF({ ...dependencies });
  return {
    rabbitAPIService,
    tokenGenerationService,
    gifService,
  };
};
