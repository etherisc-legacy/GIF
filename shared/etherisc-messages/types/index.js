const test = require('./test');


/**
 * Provider message schema by version
 * @param {{}} versionMapping
 * @return {Function}
 */
const makeVersionMatcher = versionMapping => (version) => {
  const mappingKeys = Object.keys(versionMapping).sort();
  if (mappingKeys.indexOf(version) >= 0) {
    return versionMapping[version];
  }
  if (version === 'latest') {
    return versionMapping[mappingKeys[mappingKeys.length - 1]];
  }

  throw new Error(`${version} - Version unavailable`);
};

module.exports.test = makeVersionMatcher(test);
