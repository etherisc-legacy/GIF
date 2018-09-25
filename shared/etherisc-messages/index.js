const { Validator } = require('jsonschema');
const uuid = require('uuid/v4');
const types = require('./types');


const validator = new Validator();

/**
 * Validate message against defined schema
 * @param {{}} object
 * @param {string} type
 * @param {string} version
 */
const validate = (object, type, version) => {
  const versionMatcher = types[type];
  const schema = versionMatcher(version || 'latest');
  validator.validate(object, schema);
};

/**
 * Pack message
 * @param {{}} object
 * @param {string} type
 * @param {string} version
 * @return {Buffer}
 */
const pack = (object, type, version) => {
  validate(object, type, version);
  return Buffer.from(JSON.stringify(object));
};

/**
 * Unpack message
 * @param {Bufer} buffer
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
 * @param {*} customValues
 * @return {{correlationId: string, headers: *}}
 */
const headers = (customValues) => {
  const serviceName = process.env.npm_package_name;
  const serviceVersion = process.env.npm_package_version;
  const correlationId = `${uuid()}-${serviceName}-${serviceVersion}-${process.hrtime()[0]}`;

  return {
    correlationId,
    headers: Object.assign({
      originatorName: serviceName,
      originatorVersion: serviceVersion,
    }, customValues || {}),
  };
};

module.exports = {
  pack, unpack, validate, headers,
};
