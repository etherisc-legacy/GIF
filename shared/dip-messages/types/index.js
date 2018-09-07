const test = require('./test');

const makeVersionMatcher = (versionMapping) => {
  return (version) => {
    const mappingKeys = Object.keys(versionMapping).sort();
    if (mappingKeys.indexOf(version) >= 0) {
      return versionMapping[version];
    }
    if (version == 'latest') {
      return versionMapping[mappingKeys[mappingKeys.length-1]];
    }
    throw `${version} - Version unavailable`;
  };
};

module.exports.test = makeVersionMatcher(test);
