contract('Policy module', () => {
  it('Policy module should be registered as "policy" contract', async () => {});

  /* createPolicyFlow */

  /* setPolicyFlowState */

  /* createApplication */

  /* setApplicationState */

  /* createPolicy */

  /* setPolicyState */

  /* createClaim */

  /* setClaimState */

  /* createPayout */
  it('createPayout should change payout status to PaidOut if amount equal to expected amount', async () => {});
  it('createPayout should support partial payouts', async () => {});
  it('createPayout should throw if product does not exists', async () => {});
  it('createPayout should throw if payout object has not created', async () => {});
  it('createPayout should throw if payout amount equal zero', async () => {});
  it('createPayout should throw if payout amount is more than expected amount', async () => {});

  /* payOut */

  /* setPayoutState */

  /* getApplicationData */

  /* getPayoutOptions */

  /* getPremium */
  it('getPremium should return application premium and currency', async () => {});
  it('getPremium should throw if product does not exists', async () => {});
  it('getPremium should throw if application does not exists', async () => {});
});
