const uuid = require('uuid/v4');
const types = require('./types');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

const validate = (object, type, version) => {
  const versionMatcher = types[type];
  const schema = versionMatcher(version || 'latest');
  validator.validate(object, schema);
};

const pack = (object, type, version) => {
  validate(object, type, version);
  return Buffer.from(JSON.stringify(object));
};

const unpack = (buffer, type, version) => {
  var object = JSON.parse(buffer.toString());
  validate(object, type, version);
  return object;
};

const headers = (customValues) => {
  var serviceName = process.env.npm_package_name;
  var serviceVersion = process.env.npm_package_version;
  var correlationId = `${uuid()}-${serviceName}-${serviceVersion}-${process.hrtime()[0]}`;

  return {
    correlationId: correlationId,
    headers: Object.assign({
      originatorName: serviceName,
      originatorVersion: serviceVersion,
    }, customValues || {})
  }
};

module.exports = { pack, unpack, validate, headers };
