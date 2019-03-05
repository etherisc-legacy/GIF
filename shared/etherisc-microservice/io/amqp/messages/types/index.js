const _ = require('lodash');
const requireDir = require('require-dir');

/**
 * Provider message schema by version
 * @param {{}} versionMapping
 * @return {Function}
 */
const makeVersionMatcher = versionMapping => (versionRequired) => {
  const mappingKeys = Object.keys(versionMapping).sort();
  let versionFound = null;

  if (versionRequired === 'latest') {
    versionFound = _.last(mappingKeys);
  } else if (mappingKeys.indexOf(versionRequired) >= 0) {
    versionFound = versionRequired;
  } else {
    const [majorVersion, minorVersion] = versionRequired.split('.', 2);
    if (minorVersion === '*') {
      const versionPattern = new RegExp(`${majorVersion === '*' ? '.' : majorVersion}\\..`);
      const filteredKeys = mappingKeys.filter(key => versionPattern.test(key));
      versionFound = _.last(filteredKeys);
    }
  }

  if (versionFound) {
    return { ...versionMapping[versionFound], version: versionFound };
  }

  throw new Error(`${versionRequired} - Version unavailable`);
};

module.exports = requireDir('.', {
  mapValue: value => makeVersionMatcher(value),
});
