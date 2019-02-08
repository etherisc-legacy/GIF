---
id: modules_policy_PolicyController.v1_PolicyController
title: PolicyController
---

<div class="contract-doc"><div class="contract"><h2 class="contract-header"><span class="contract-kind">contract</span> PolicyController</h2><p class="base-contracts"><span>is</span> <a href="shared_CoreContract.html">CoreContract</a><span>, </span><a href="modules_policy_PolicyStorageModel.html">PolicyStorageModel</a><span>, </span><a href="shared_ModuleController.html">ModuleController</a></p><div class="source">Source: <a href="/blob/v1.0.0/contracts/modules/policy/PolicyController.v1.sol" target="_blank">modules/policy/PolicyController.v1.sol</a></div></div><div class="index"><h2>Index</h2><ul><li><a href="modules_policy_PolicyController.v1_PolicyController.html#createApplication">createApplication</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#createClaim">createClaim</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#createPayout">createPayout</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#createPolicy">createPolicy</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#createPolicyFlow">createPolicyFlow</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#">fallback</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#getApplicationData">getApplicationData</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#getPayoutOptions">getPayoutOptions</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#payOut">payOut</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#setApplicationState">setApplicationState</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#setClaimState">setClaimState</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#setPayoutState">setPayoutState</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#setPolicyFlowState">setPolicyFlowState</a></li><li><a href="modules_policy_PolicyController.v1_PolicyController.html#setPolicyState">setPolicyState</a></li></ul></div><div class="reference"><h2>Reference</h2><div class="functions"><h3>Functions</h3><ul><li><div class="item function"><span id="createApplication" class="anchor-marker"></span><h4 class="name">createApplication</h4><div class="body"><code class="signature">function <strong>createApplication</strong><span>(uint256 _insuranceApplicationId, uint256 _metadataId, bytes32 _customerExternalId, uint256 _premium, uint256 _currency, uint256[] _payoutOptions) </span><span>external </span><span>returns  (bool, uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_metadataId</code> - uint256</div><div><code>_customerExternalId</code> - bytes32</div><div><code>_premium</code> - uint256</div><div><code>_currency</code> - uint256</div><div><code>_payoutOptions</code> - uint256[]</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="createClaim" class="anchor-marker"></span><h4 class="name">createClaim</h4><div class="body"><code class="signature">function <strong>createClaim</strong><span>(uint256 _insuranceApplicationId, uint256 _policyId, bytes32 _data) </span><span>external </span><span>returns  (bool, uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_policyId</code> - uint256</div><div><code>_data</code> - bytes32</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="createPayout" class="anchor-marker"></span><h4 class="name">createPayout</h4><div class="body"><code class="signature">function <strong>createPayout</strong><span>(uint256 _insuranceApplicationId, uint256 _claimId, uint256 _amount) </span><span>external </span><span>returns  (bool, uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_claimId</code> - uint256</div><div><code>_amount</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="createPolicy" class="anchor-marker"></span><h4 class="name">createPolicy</h4><div class="body"><code class="signature">function <strong>createPolicy</strong><span>(uint256 _insuranceApplicationId, uint256 _metadataId) </span><span>external </span><span>returns  (bool, uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_metadataId</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="createPolicyFlow" class="anchor-marker"></span><h4 class="name">createPolicyFlow</h4><div class="body"><code class="signature">function <strong>createPolicyFlow</strong><span>(uint256 _insuranceApplicationId) </span><span>external </span><span>returns  (bool, uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="fallback" class="anchor-marker"></span><h4 class="name">fallback</h4><div class="body"><code class="signature">function <strong></strong><span>(address _registry) </span><span>public </span></code><hr/><dl><dt><span class="label-modifiers">Modifiers:</span></dt><dd></dd><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_registry</code> - address</div></dd></dl></div></div></li><li><div class="item function"><span id="getApplicationData" class="anchor-marker"></span><h4 class="name">getApplicationData</h4><div class="body"><code class="signature">function <strong>getApplicationData</strong><span>(uint256 _insuranceApplicationId, uint256 _applicationId) </span><span>external </span><span>view </span><span>returns  (uint256, bytes32, uint256, uint256, ApplicationState) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_applicationId</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256</dd><dd>bytes32</dd><dd>uint256</dd><dd>uint256</dd><dd>ApplicationState</dd></dl></div></div></li><li><div class="item function"><span id="getPayoutOptions" class="anchor-marker"></span><h4 class="name">getPayoutOptions</h4><div class="body"><code class="signature">function <strong>getPayoutOptions</strong><span>(uint256 _insuranceApplicationId, uint256 _applicationId) </span><span>external </span><span>view </span><span>returns  (uint256[]) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_applicationId</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256[]</dd></dl></div></div></li><li><div class="item function"><span id="payOut" class="anchor-marker"></span><h4 class="name">payOut</h4><div class="body"><code class="signature">function <strong>payOut</strong><span>(uint256 _insuranceApplicationId, uint256 _payoutId, uint256 _amount) </span><span>external </span><span>returns  (uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_payoutId</code> - uint256</div><div><code>_amount</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="setApplicationState" class="anchor-marker"></span><h4 class="name">setApplicationState</h4><div class="body"><code class="signature">function <strong>setApplicationState</strong><span>(uint256 _insuranceApplicationId, uint256 _applicationId, ApplicationState _state) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_applicationId</code> - uint256</div><div><code>_state</code> - ApplicationState</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="setClaimState" class="anchor-marker"></span><h4 class="name">setClaimState</h4><div class="body"><code class="signature">function <strong>setClaimState</strong><span>(uint256 _insuranceApplicationId, uint256 _claimId, ClaimState _state) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_claimId</code> - uint256</div><div><code>_state</code> - ClaimState</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="setPayoutState" class="anchor-marker"></span><h4 class="name">setPayoutState</h4><div class="body"><code class="signature">function <strong>setPayoutState</strong><span>(uint256 _insuranceApplicationId, uint256 _payoutId, PayoutState _state) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_payoutId</code> - uint256</div><div><code>_state</code> - PayoutState</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="setPolicyFlowState" class="anchor-marker"></span><h4 class="name">setPolicyFlowState</h4><div class="body"><code class="signature">function <strong>setPolicyFlowState</strong><span>(uint256 _insuranceApplicationId, uint256 _metadataId, PolicyFlowState _state) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_metadataId</code> - uint256</div><div><code>_state</code> - PolicyFlowState</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="setPolicyState" class="anchor-marker"></span><h4 class="name">setPolicyState</h4><div class="body"><code class="signature">function <strong>setPolicyState</strong><span>(uint256 _insuranceApplicationId, uint256 _policyId, PolicyState _state) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_insuranceApplicationId</code> - uint256</div><div><code>_policyId</code> - uint256</div><div><code>_state</code> - PolicyState</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li></ul></div></div></div>