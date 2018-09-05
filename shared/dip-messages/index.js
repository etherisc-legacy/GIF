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

module.exports = { pack, unpack, validate };
