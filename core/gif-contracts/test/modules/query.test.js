contract('Query module', () => {
  it('query module should be registered as "query" contract', async () => {});

  /* OracleType */

  /* proposeOracleType */
  it('proposeOracleType should create inactive but initialized OracleType record', async () => {});
  it('proposeOracleType should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracleType should throw if OracleType has already initialized', async () => {});

  /* activateOracleType */
  it('activateOracleType should switch OracleType to active state', async () => {});
  it('activateOracleType should be restricted to calls only from DAOService', async () => {});
  it('activateOracleType should throw is OracleType is in active state', async () => {});
  it('activateOracleType should throw if OracleType not exists', async () => {});

  /* deactivateOracleType */
  it('deactivateOracleType should switch OracleType to inactive state', async () => {});
  it('deactivateOracleType should be restricted to calls only from DAOService', async () => {});
  it('deactivateOracleType should throw if OracleType not exists', async () => {});
  it('deactivateOracleType should throw is OracleType is not in active state', async () => {});
  it('deactivateOracleType should throw is OracleType has assigned oracles', async () => {});

  /* removeOracleType */
  it('removeOracleType should remove OracleType record', async () => {});
  it('deactivateOracleType should be restricted to calls only from DAOService', async () => {});
  it('removeOracleType should throw if OracleType not exists', async () => {});
  it('removeOracleType should throw is OracleType is in active state', async () => {});
  it('removeOracleType should throw is OracleType has assigned oracles', async () => {});

  /* Oracle */

  /* proposeOracle */
  it('proposeOracle should create Oracle record in inactive state', async () => {});
  it('proposeOracle should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracle should throw if oracle exists', async () => {});

  /* revokeOracleProposal */
  it('revokeOracleProposal should remove Oracle proposal record', async () => {});
  it('revokeOracleProposal should be restricted to calls only from OracleOwnerService', async () => {});

  /* updateOracleContract */
  it('updateOracleContract should update Oracle with new contract address', async () => {});
  it('updateOracleContract should be restricted to calls only from OracleOwnerService', async () => {});

  /* activateOracle */
  it('activateOracle switch Oracle in active state', async () => {});
  it('activateOracle should be restricted to calls only from DAOService', async () => {});

  /* deactivateOracle */
  it('deactivateOracle should switch Oracle in inactive state', async () => {});
  it('deactivateOracle should be restricted to calls only from DAOService', async () => {});

  /* removeOracle */
  it('removeOracle should remove Oracle record', async () => {});
  it('removeOracle should be restricted to calls only from DAOService', async () => {});

  /* Oracle-OracleType */

  /* proposeOracleToType */
  it('proposeOracleToType should create Oracle to OracleType proposal record ', async () => {});
  it('proposeOracleToType should be restricted to calls only from OracleOwnerService', async () => {});

  /* revokeOracleToTypeProposal */
  it('revokeOracleToTypeProposal should remove Oracle to OracleType proposal record', async () => {});
  it('revokeOracleToTypeProposal should be restricted to calls only from OracleOwnerService', async () => {});

  /* assignOracleToOracleType */
  it('assignOracleToOracleType should bind Oracle to OracleType', async () => {});
  it('assignOracleToOracleType should be restricted to calls only from DAOService', async () => {});

  /* removeOracleFromOracleType */
  it('removeOracleFromOracleType should remove Oracle from OracleType', async () => {});
  it('removeOracleFromOracleType should be restricted to calls only from DAOService', async () => {});

  /* Request */
  it('request should take product request and send it to oracle', async () => {});
  it('request should be restricted to calls only from ProductService', async () => {});

  /* Respond */
  it('respond should take oracle response and send it to product', async () => {});
  it('respond should be restricted to calls only from OracleService', async () => {});
});
