const { Validator } = require('jsonschema');
const uuid = require('uuid/v4');
const types = require('./types');


const validator = new Validator();

/**
 * Find the latest schema for type and version
 * @param {string} type
 * @param {string} version
 * @return {{}}
 */
const findMessageSchema = (type, version) => {
  const versionMatcher = types[type];
  if (!versionMatcher) console.error(type, 'not found among known types'); // eslint-disable-line no-console
  return versionMatcher(version || 'latest');
};

/**
 * Validate message against defined schema
 * @param {{}} object
 * @param {string} type
 * @param {string} version
 */
const validate = (object, type, version) => {
  const result = validator.validate(object, findMessageSchema(type, version));
  if (!result.valid) {
    throw new Error(`Wrong schema format for message type '${type}' v${version} : ${result.errors}`);
  }
};

/**
 * Pack message
 * @param {{}} object
 * @param {string} type
 * @param {string} version
 * @return {Buffer}
 */
const pack = (object, type, version) => {
  const payload = JSON.stringify(object);
  validate(JSON.parse(payload), type, version);
  return Buffer.from(payload);
};

/**
 * Unpack message
 * @param {Buffer} buffer
 * @param {string} type
 * @param {string} version
 * @return {*}
 */
const unpack = (buffer, type, version) => {
  const object = JSON.parse(buffer.toString());
  validate(object, type, version);
  return object;
};

/**
 * Set message headers
 * @param {string} correlationId
 * @param {{}} customValues
 * @param {string} serviceName
 * @param {string} serviceVersion
 * @param {string} messageType
 * @param {string} messageTypeVersion
 * @return {{correlationId: string, headers: *}}
 */
const headers = (correlationId, customValues, serviceName, serviceVersion, messageType, messageTypeVersion) => {
  const newCorrelationId = correlationId || `${uuid()}-${serviceName}-${serviceVersion}-${messageType}-${process.hrtime()[0]}`;

  return {
    persistent: true,
    mandatory: true,
    correlationId: newCorrelationId,
    headers: {
      ...customValues,
      messageType,
      messageTypeVersion,
      originatorName: serviceName,
      originatorVersion: serviceVersion,
    },
  };
};

module.exports = {
  pack, unpack, validate, headers, findMessageSchema,
};
