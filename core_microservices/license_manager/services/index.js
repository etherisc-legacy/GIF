const RabbitAPIService = require('./RabbitAPIService');
const TokenGenerationService = require('./TokenGenerationService');


module.exports = (dependencies) => {
  const rabbitAPIService = new RabbitAPIService({ ...dependencies });
  const tokenGenerationService = new TokenGenerationService({ ...dependencies });

  return {
    rabbitAPIService,
    tokenGenerationService,
  };
};
