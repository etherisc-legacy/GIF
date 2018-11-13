/* global web3: true, artifacts: true, contract: true, assert: true */

const moment = require('moment');
const {
  latestTime, duration, increaseTimeTo, assertRevert, advanceBlock,
} = require('./helpers');


const EStoreInsurance = artifacts.require('EStoreInsurance');

require('chai')
  .use(require('chai-as-promised'))
  .should();


const PolicyState = {
  Applied: '0',
  Accepted: '1',
  ForPayout: '2',
  PaidOut: '3',
  Expired: '4',
  Declined: '5',
};

const ClaimState = {
  Applied: '0',
  Rejected: '1',
  Confirmed: '2',
};

const Currency = {
  EUR: '0',
  USD: '1',
  GBP: '2',
  CZK: '3',
};

let insurance;
let owner;


contract('EStoreInsurance', (accounts) => {
  before(async () => {
    insurance = await EStoreInsurance.deployed();
    [owner] = accounts;
  });

  it('deployer should be become an owner of insurance app', async () => {
    const contractOwner = await insurance.owner();

    contractOwner.should.be.equal(owner);
  });

  it('new policy should be created with method newPolicy', async () => {
    const policy = await insurance.newPolicy(
      web3.utils.asciiToHex('A1234'),
      web3.utils.asciiToHex('Notebook'),
      100,
      4000,
      Currency.EUR,
      moment().add(1, 'year').unix(),
      web3.utils.asciiToHex('1278-1278-1278-1278'),
    );

    const { logs } = policy;

    logs.length.should.be.equal(1);
    logs[0].args._policyId.toString().should.be.equal('0');
    logs[0].args._state.toString().should.be.equal(PolicyState.Applied);
    logs[0].args._state.toString().should.be.equal(PolicyState.Applied);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal('Applied by customer');
  });

  it('getPoliciesCount should return total number of policies', async () => {
    await insurance.newPolicy(
      web3.utils.asciiToHex('B5678'),
      web3.utils.asciiToHex('Smartphone'),
      50,
      3000,
      Currency.USD,
      moment().add(1, 'year').unix(),
      web3.utils.asciiToHex('1111-2222-3333-4444'),
    );

    const total = await insurance.getPoliciesCount();

    total.toString().should.be.equal('2');
  });

  it('policy could be underwritten with method undewrite', async () => {
    const policyId = '0';

    const underwrite = await insurance.underwrite(policyId);

    const { logs } = underwrite;

    logs.length.should.be.equal(1);
    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(PolicyState.Accepted);
    logs[0].args._state.toString().should.be.equal(PolicyState.Accepted);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal('Underwritten');

    const policy = await insurance.policies.call(policyId);
    policy.state.toString().should.be.equal(PolicyState.Accepted);
  });

  it('policy could be declined with method decline', async () => {
    const policyId = '1';
    const reason = 'reason to decline';

    const decline = await insurance.decline(policyId, web3.utils.asciiToHex(reason));

    const { logs } = decline;

    logs.length.should.be.equal(1);
    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(PolicyState.Declined);
    logs[0].args._state.toString().should.be.equal(PolicyState.Declined);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(reason);

    const policy = await insurance.policies.call(policyId);
    policy.state.toString().should.be.equal(PolicyState.Declined);
    web3.utils.hexToUtf8(policy.stateMessage).toString().should.be.equal(reason);
  });

  it('claim for policy could be created with newClaim method', async () => {
    const policyId = '0';
    const reason = 'reason for claim';

    const claim = await insurance.newClaim(
      policyId,
      web3.utils.asciiToHex(reason),
    );

    const { logs } = claim;

    logs.length.should.be.equal(1);
    logs[0].args._claimId.toString().should.be.equal('0');
    logs[0].args._policyId.toString().should.be.equal('0');
    logs[0].args._state.toString().should.be.equal(ClaimState.Applied);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(reason);

    const claimRecord = await insurance.claims.call('0');

    claimRecord.policyId.toString().should.be.equal(policyId);
    claimRecord.state.toString().should.be.equal(ClaimState.Applied);
    web3.utils.hexToUtf8(claimRecord.stateMessage).toString().should.be.equal(reason);
  });

  it('getClaimsCount should return total number of claims', async () => {
    await insurance.newClaim(
      '0',
      web3.utils.asciiToHex('reason'),
    );

    const total = await insurance.getClaimsCount();

    total.toString().should.be.equal('2');
  });

  it('claim could be rejected with rejectClaim method', async () => {
    const claimId = '1';
    const policyId = '0';
    const reason = 'reason to reject';

    const reject = await insurance.rejectClaim(claimId, web3.utils.asciiToHex(reason));

    const { logs } = reject;

    logs.length.should.be.equal(1);
    logs[0].args._claimId.toString().should.be.equal(claimId);
    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(ClaimState.Rejected);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(reason);

    const claimRecord = await insurance.claims.call(claimId);

    claimRecord.policyId.toString().should.be.equal(policyId);
    claimRecord.state.toString().should.be.equal(ClaimState.Rejected);
    web3.utils.hexToUtf8(claimRecord.stateMessage).toString().should.be.equal(reason);
  });

  it('claim could be confirmed with confirmClaim method', async () => {
    const claimId = '0';
    const policyId = '0';
    const reason = 'reason to confirm';

    const confirm = await insurance.confirmClaim(claimId, web3.utils.asciiToHex(reason));

    const { logs } = confirm;

    logs.length.should.be.equal(2);

    logs[0].args._claimId.toString().should.be.equal(claimId);
    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(ClaimState.Confirmed);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(reason);

    logs[1].args._policyId.toString().should.be.equal(policyId);
    logs[1].args._state.toString().should.be.equal(PolicyState.ForPayout);
    logs[1].args._state.toString().should.be.equal(PolicyState.ForPayout);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(reason);

    const claimRecord = await insurance.claims.call(claimId);

    claimRecord.policyId.toString().should.be.equal(policyId);
    claimRecord.state.toString().should.be.equal(ClaimState.Confirmed);
    web3.utils.hexToUtf8(claimRecord.stateMessage).toString().should.be.equal(reason);

    const policyRecord = await insurance.policies.call(policyId);
    policyRecord.state.toString().should.be.equal(PolicyState.ForPayout);
    web3.utils.hexToUtf8(policyRecord.stateMessage).toString().should.be.equal('Claim is confirmed');

    const riskRecord = await insurance.risks.call(policyRecord.riskId);
    policyRecord.expectedPayout.toString().should.be.equal(riskRecord.sumInsured.toString());
  });

  it('payout could be confirmed with confirmPayout method', async () => {
    const policyId = '0';
    const proof = 'payment-id';

    const policyRecordBefore = await insurance.policies.call(policyId);
    const riskRecord = await insurance.risks.call(policyRecordBefore.riskId);
    const sumInsured = riskRecord.sumInsured.toString();
    policyRecordBefore.expectedPayout.toString().should.be.equal(sumInsured);

    const confirm = await insurance.confirmPayout(policyId, web3.utils.asciiToHex(proof));

    const { logs } = confirm;

    logs.length.should.be.equal(1);

    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(PolicyState.PaidOut);
    logs[0].args._state.toString().should.be.equal(PolicyState.PaidOut);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal(proof);

    const policyRecord = await insurance.policies.call(policyId);
    policyRecord.state.toString().should.be.equal(PolicyState.PaidOut);
    web3.utils.hexToUtf8(policyRecord.stateMessage).toString().should.be.equal(proof);
    policyRecord.expectedPayout.toString().should.be.equal('0');
    policyRecord.actualPayout.toString().should.be.equal(sumInsured);
  });

  it('policy could not be set to expired before expiration data', async () => {
    await insurance.newPolicy(
      web3.utils.asciiToHex('B5678'),
      web3.utils.asciiToHex('Smartphone'),
      50,
      3000,
      Currency.USD,
      moment().add(1, 'hour').unix(),
      web3.utils.asciiToHex('1111-2222-3333-4444'),
    );

    const policyId = '2';

    await insurance.underwrite(policyId);

    try {
      await insurance.expire(policyId);
    } catch (error) {
      assertRevert(error);
      return;
    }

    assert.fail('should have thrown before');
  });

  it('policy could be set to expired state after expiration period', async () => {
    const policyId = '2';

    const time = await latestTime();
    await increaseTimeTo(time + duration.hours(2));
    await advanceBlock();

    const expire = await insurance.expire(policyId);

    const { logs } = expire;

    logs.length.should.be.equal(1);

    logs[0].args._policyId.toString().should.be.equal(policyId);
    logs[0].args._state.toString().should.be.equal(PolicyState.Expired);
    logs[0].args._state.toString().should.be.equal(PolicyState.Expired);
    web3.utils.hexToUtf8(logs[0].args._stateMessage).should.be.equal('Expired');

    const policyRecord = await insurance.policies.call(policyId);
    policyRecord.state.toString().should.be.equal(PolicyState.Expired);
    web3.utils.hexToUtf8(policyRecord.stateMessage).toString().should.be.equal('Expired');
  });
});
