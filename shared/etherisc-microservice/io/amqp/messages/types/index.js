const _ = require('lodash');

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

const existingEventsRequest = require('./existingEventsRequest');


module.exports.existingEventsRequest = makeVersionMatcher(existingEventsRequest);

const artifact = require('./artifact');


module.exports.artifact = makeVersionMatcher(artifact);

const artifactList = require('./artifactList');


module.exports.artifactList = makeVersionMatcher(artifactList);

const artifactRequest = require('./artifactRequest');


module.exports.artifactRequest = makeVersionMatcher(artifactRequest);

const artifactListRequest = require('./artifactListRequest');


module.exports.artifactListRequest = makeVersionMatcher(artifactListRequest);

const contractDeployment = require('./contractDeployment');


module.exports.contractDeployment = makeVersionMatcher(contractDeployment);

const decodedEvent = require('./decodedEvent');


module.exports.decodedEvent = makeVersionMatcher(decodedEvent);

const policyCreationRequest = require('./policyCreationRequest');


module.exports.policyCreationRequest = makeVersionMatcher(policyCreationRequest);

const policyCreationSuccess = require('./policyCreationSuccess');


module.exports.policyCreationSuccess = makeVersionMatcher(policyCreationSuccess);

const policyCreationError = require('./policyCreationError');


module.exports.policyCreationError = makeVersionMatcher(policyCreationError);

const stateChanged = require('./stateChanged');


module.exports.stateChanged = makeVersionMatcher(stateChanged);

const transactionCreated = require('./transactionCreated');


module.exports.transactionCreated = makeVersionMatcher(transactionCreated);

const chargeCard = require('./chargeCard');


module.exports.chargeCard = makeVersionMatcher(chargeCard);

const issueCertificate = require('./issueCertificate');


module.exports.issueCertificate = makeVersionMatcher(issueCertificate);

const payout = require('./payout');


module.exports.payout = makeVersionMatcher(payout);

const paidOut = require('./paidOut');


module.exports.paidOut = makeVersionMatcher(paidOut);

const cardCharged = require('./cardCharged');


module.exports.cardCharged = makeVersionMatcher(cardCharged);
