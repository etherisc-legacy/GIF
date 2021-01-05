---
id: modules_license_LicenseController
title: LicenseController
---

<div class="contract-doc"><div class="contract"><h2 class="contract-header"><span class="contract-kind">contract</span> LicenseController</h2><p class="base-contracts"><span>is</span> <a href="shared_CoreContract.html">CoreContract</a><span>, </span><a href="modules_license_LicenseStorageModel_LicenceStorageModel.html">LicenceStorageModel</a><span>, </span><a href="shared_ModuleController.html">ModuleController</a></p><div class="source">Source: <a href="/blob/v1.0.0/contracts/modules/license/LicenseController.sol" target="_blank">modules/license/LicenseController.sol</a></div></div><div class="index"><h2>Index</h2><ul><li><a href="modules_license_LicenseController.html#approveRegistration">approveRegistration</a></li><li><a href="modules_license_LicenseController.html#declineRedegistration">declineRedegistration</a></li><li><a href="modules_license_LicenseController.html#disapproveInsuranceApplication">disapproveInsuranceApplication</a></li><li><a href="modules_license_LicenseController.html#">fallback</a></li><li><a href="modules_license_LicenseController.html#getInsuranceApplicationId">getInsuranceApplicationId</a></li><li><a href="modules_license_LicenseController.html#isApprovedInsuranceApplication">isApprovedInsuranceApplication</a></li><li><a href="modules_license_LicenseController.html#isPausedInsuranceApplication">isPausedInsuranceApplication</a></li><li><a href="modules_license_LicenseController.html#isValidCall">isValidCall</a></li><li><a href="modules_license_LicenseController.html#pauseInsuranceApplication">pauseInsuranceApplication</a></li><li><a href="modules_license_LicenseController.html#reapproveInsuranceApplication">reapproveInsuranceApplication</a></li><li><a href="modules_license_LicenseController.html#register">register</a></li><li><a href="modules_license_LicenseController.html#unpauseInsuranceApplication">unpauseInsuranceApplication</a></li></ul></div><div class="reference"><h2>Reference</h2><div class="functions"><h3>Functions</h3><ul><li><div class="item function"><span id="approveRegistration" class="anchor-marker"></span><h4 class="name">approveRegistration</h4><div class="body"><code class="signature">function <strong>approveRegistration</strong><span>(uint256 _registrationId) </span><span>external </span><span>returns  (uint256) </span></code><hr/><div class="description"><p>Approve registration and create new insurance application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_registrationId</code> - uint256</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="declineRedegistration" class="anchor-marker"></span><h4 class="name">declineRedegistration</h4><div class="body"><code class="signature">function <strong>declineRedegistration</strong><span>(uint256 _registrationId) </span><span>external </span></code><hr/><div class="description"><p>Decline new application registration.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_registrationId</code> - uint256</div></dd></dl></div></div></li><li><div class="item function"><span id="disapproveInsuranceApplication" class="anchor-marker"></span><h4 class="name">disapproveInsuranceApplication</h4><div class="body"><code class="signature">function <strong>disapproveInsuranceApplication</strong><span>(uint256 _applicationId) </span><span>external </span></code><hr/><div class="description"><p>Disapprove insurance application once it was approved.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_applicationId</code> - uint256</div></dd></dl></div></div></li><li><div class="item function"><span id="fallback" class="anchor-marker"></span><h4 class="name">fallback</h4><div class="body"><code class="signature">function <strong></strong><span>(address _registry) </span><span>public </span></code><hr/><dl><dt><span class="label-modifiers">Modifiers:</span></dt><dd></dd><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_registry</code> - address</div></dd></dl></div></div></li><li><div class="item function"><span id="getInsuranceApplicationId" class="anchor-marker"></span><h4 class="name">getInsuranceApplicationId</h4><div class="body"><code class="signature">function <strong>getInsuranceApplicationId</strong><span>(address _addr) </span><span>public </span><span>view </span><span>returns  (uint256) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_addr</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="isApprovedInsuranceApplication" class="anchor-marker"></span><h4 class="name">isApprovedInsuranceApplication</h4><div class="body"><code class="signature">function <strong>isApprovedInsuranceApplication</strong><span>(address _addr) </span><span>public </span><span>view </span><span>returns  (bool) </span></code><hr/><div class="description"><p>Check if contract is approved insurance application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_addr</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="isPausedInsuranceApplication" class="anchor-marker"></span><h4 class="name">isPausedInsuranceApplication</h4><div class="body"><code class="signature">function <strong>isPausedInsuranceApplication</strong><span>(address _addr) </span><span>public </span><span>view </span><span>returns  (bool) </span></code><hr/><div class="description"><p>Check if contract is paused insurance application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_addr</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="isValidCall" class="anchor-marker"></span><h4 class="name">isValidCall</h4><div class="body"><code class="signature">function <strong>isValidCall</strong><span>(address _addr) </span><span>public </span><span>view </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_addr</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="pauseInsuranceApplication" class="anchor-marker"></span><h4 class="name">pauseInsuranceApplication</h4><div class="body"><code class="signature">function <strong>pauseInsuranceApplication</strong><span>(uint256 _applicationId) </span><span>external </span></code><hr/><div class="description"><p>Pause application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_applicationId</code> - uint256</div></dd></dl></div></div></li><li><div class="item function"><span id="reapproveInsuranceApplication" class="anchor-marker"></span><h4 class="name">reapproveInsuranceApplication</h4><div class="body"><code class="signature">function <strong>reapproveInsuranceApplication</strong><span>(uint256 _applicationId) </span><span>external </span></code><hr/><div class="description"><p>Reapprove application once it was disapproved.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_applicationId</code> - uint256</div></dd></dl></div></div></li><li><div class="item function"><span id="register" class="anchor-marker"></span><h4 class="name">register</h4><div class="body"><code class="signature">function <strong>register</strong><span>(bytes32 _name, address _addr) </span><span>external </span><span>returns  (uint256) </span></code><hr/><div class="description"><p>Register new application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_name</code> - bytes32</div><div><code>_addr</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>uint256</dd></dl></div></div></li><li><div class="item function"><span id="unpauseInsuranceApplication" class="anchor-marker"></span><h4 class="name">unpauseInsuranceApplication</h4><div class="body"><code class="signature">function <strong>unpauseInsuranceApplication</strong><span>(uint256 _applicationId) </span><span>external </span></code><hr/><div class="description"><p>Unpause application.</p></div><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_applicationId</code> - uint256</div></dd></dl></div></div></li></ul></div></div></div>