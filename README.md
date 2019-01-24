# Generic Insurance Framework
The Generic Insurance Framework (GIF) represents a combined codebase for the Decentralized Insurance Platform, a basic 
implementation that allows Insurance Product applications development. 
In its core GIF accumulates a number of smart contracts, which can be conveniently accessed via a set of microservices.
The core smart contracts can then be used by product specific smart contracts and microservices:

   * Core smart contracts 
   * Core microservices 
   * Insurance Product specific smart contracts 
   * Insurance Product specific microservices 

The core contracts are deployed on-chain and operate as a shared service for possibly many different insurance products. 
An Insurance product which works on top of GIF is a smart contract (or set of smart contracts) connected to GIF core
contracts through the interface of a unique entry point.

By this, any Product Owner can create a full-featured Insurance DApp by simply adding one or a few product-specific 
contracts to the set of core contracts that GIF provides. To put it in numbers: The FlightDelay product specific
code is below 200 LOC (lines of code), while the full FlightDelay DApp used to have more than a few thousand LOC.

## Operating Models
The GIF is _just_ open source code, so we do not make any assumptions on _how_ this code is operated. In the same
way like Linux can be operated in different environments, the GIF can be operated in different models. 

There can be many instances of the GIF running in parallel, in the same way like anybody can setup a separate Ethereum chain 
with a few clicks. It can be run on public and private chains. 

But of course there will be (one or more) instances which are deployed by the Etherisc Team on the Ethereum Mainnet 
as an offering to Product Builders who do not want to run and maintain a full GIF instance by themselves.
These instance(s) will be managed by the Etherisc Team in the beginning, with the option to move to a DAO-like 
governance model in the future, as soon as the requirements of Product Owners are clearly specified.  

##  Smart Contracts Architecture
The GIF Smart contracts architecture is designed in the way that any insurance product built on top of GIF 
can be easily implemented. 
The GIF declares the underlying principles and requirements based on which smart contracts architecture is developed:

   * The GIF provides a unified interface which connects insurance applications to data and decision providers (oracles) 
   * Insurance product contracts utilize simple and clear interfaces for integration with GIF. 
   * Core contracts and product specific contracts are upgradeable. Upgradability is needed to deliver fixes and new features . 

The smallest building blocks are called "modules". A module is a pair consisting of a storage contract and its controller(s). 
They share the same storage model and interface objects. The storage contract is a proxy and delegates calls from 
storage to controller. This mechanic brings upgradeability to the module.
Modules are controlled by actions. An action is a building block of a policy flow - by this it is possible to implement
different policy flows with a different sets of actions. The policy flow basically implements the lifecycle of an
insurance policy - it defines when payments are made, when oracles are requested, and when a policy changes its state.

##  Core Smart Contracts
Core smart contracts represent a number of key contracts and modules. Product Controller, Policy flow and modules are described below.

##  Product Controller

The `Product Controller` is an entry point for Insurance Product application. When deploying smart contract Insurance Product 
application passes arguments, and should pass ProductController address as one of the arguments.
All Product Controller methods are used by Insurance Product application.
Methods invoked by Product Controller:

   * **newApplication**  
   Method is used to store new application data which contains such fields as premium amount, currency, payout options, risk definition etc. Policy buyer signs policy agreement using this method.
   * **underwrite**  
	Method is used to sign policy agreement from the side of insurance company. 
   * **decline**  
	Method is used to decline application. 
   * **newClaim**  
	Method is used to declare a new claim.
   * **confirmClaim**  
	Used to confirm a claim. New payout object is created after it.
   * **declineClaim**  
	Used to decline a claim.
   * **payout**  
	Used to declare payout which was handled off-chain or on-chain based on policy currency.
   * **expire**  
	Used to set policy expiration.
   * **register**  
	Used to register new insurance applications. After approval a contract obtains access to call entry methods.
   * **query**  
	Method is used to communicate with oracles when insurance application requires data or decision of particular actor. 

##  Policy Flow

The `Policy Flow` contract manages modules level to handle policy lifecycle. 
It contains the logic of how to handle GIF contract modules and operate application, policy, claim and payout entities.
Action is a building block of a policy flow. Actions are controlled by PolicyFlow contract. It exposes public interface. Insurance Product contract uses this interface to start and control policy flow lifecycle. 

##  Modules

`Modules` are system objects which exist specifically to service and maintain Etherisc platform needs.
Here is the list of modules:

	* Policy module (manages applications, policies, claims, payouts and metadata objects)
	* Access module (defines permissions between contracts and actors)
	* Ledger module (bookkeeper for insurance operations, aggregates premiums, payouts, expenses etc.)
	* Registry module (registers sets of core contracts which are used in policy flow lifecycle in release groups)
	* License module (manages insurance applications)
	* Query module (manages queries to oracles and delivers responses from them).
 
##  License Module

The `License module` exists in order to manage the approval and disapproval of Insurance Products. 
Approval happens by registering a smart contract and authorize a particular contract address. 
Insurance Products are registered in a smart contract, and its registration proposal is on review for administrator, 
who can then perform certain actions regarding this registration.
Except register method, all License Controller methods are used by platform administrator.
The platform administrator can be a single account or it can be a DAO-like structure which is governed by a 
consortium, e.g. the consortium of all product owners.

_Note: The different roles and responsibilities in the platform will described in detail in a separate document._ 

Methods invoked by License Controller:

   * **register**    
	Method is used to register a proposal by Insurance Product.
   * **approveRegistration**  
	Method is called by platform administrator and is used to approve registration. 
   * **declineRegistration**  
	Method is called by platform administrator and is used to decline registration. 
   * **disapproveProduct** . 
	Method is called when administrator approved registration and then wants to decline it.
   * **reapproveProduct**  
	Method is called when administrator declined registration and then wants to approve it.
   * **pauseProduct**  
	Used when administrator wants to pause Insurance Product.
   * **unpauseProduct**  
	Used when administrator wants to unpause Insurance Product.
   * **isApproved**   
	Used by administrator to check if Insurance Product is approved.
   * **isPaused**  
	Used by administrator to check if Insurance Product is paused.
   * **isValidCall**  
	Used by administrator to check if Insurance Product call is valid.
   * **authorize**  
	Used by administrator to check Insurance Product address is authorised and what policy flow it uses.
   * **getInsuranceProductId**  
	Used by administrator to check Insurance Product Id it has.

##  Policy Module

The `Policy` module exists in order to manage applications, policies, claims, payouts and metadata objects.
The Policy module is managed by Policy Flow contract.
Methods invoked by Policy Controller:

   * **createPolicyFlow**  
	Method is called to create a new policy flow.
   * **setPolicyFlowState**  
	Method is called to set policy flow state.
   * **createApplication** 
	Method is called to create a new application.
   * **setApplicationState** 
	Method is called to set application state.
   * **getApplicationData** 
	Called to view application data per application Id.
   * **getPayoutOptions** 
	Called to view payout options per application Id.
   * **getPremium** 
	Called to view premium amount per application Id.
   * **createPolicy** 
	Method is called to create a new policy.
   * **setPolicyState** 
	Method is called automatically to set policy state.
   * **createClaim** 
	Method is called to create a new claim.
   * **setClaimState** 
	Method is called automatically to set claim state.
   * **createPayout** 
	Method is called to create a new payout.
   * **payOut** 
	Method is called to get a data on payout remainder.
   * **setPayoutState** 
	Method is called automatically to set payout state. 

##  Registry Module

The `Registry` module exists in order to register sets of core contracts which are used in policy flow lifecycle in release groups. 
Registry module is managed by platform admin or registry module owner.
See the list of available functions below:

   * **registerInRelease**  
	Method is used to register new policies in new release version.
   * **register**  
	Method is used to register contract in last release.
   * **deregisterInRelease**   
	Method is used to delete contract from release.
   * **deregister**  
	Method is used to delete contract in last release.
   * **prepareRelease**  
	Method is called to create new release, move contracts from last release to new one and update release version.
   * **getInContractRelease**  
	Used to get contract address depending on release version.
   * **getContract**  
	Used to get contract address in last release.
   * **getRelease**  
	Used to get last release number.  

# How-To Start Building your Product

For any Insurance Product which expects to perform certain actions on Etherisc platform it is a first necessity to 
register its Insurance Product within the platform.
The registration of a Product takes place on a smart contracts level.
The Insurance Product creates a contract which inherits one of the core GIF contracts - the Product Application contract. 
A function called register is used to register the new Insurance Product. After platform administrator’s approval 
a contract obtains access to call entry methods. After inheriting Insurance Product is able to use GIF functions 
to describe its business process. All functions are specified in Product Controller section below.
Check [FlightDelay example](core/gif-contracts/contracts/examples/FlightDelayManual/FlightDelayManual.sol) with comments to visualize the logic of Insurance Product application built on top of GIF.

1.	Provide Insurance Product application name.
2.	Specify policy flow.
    FlightDelay uses Default Policy Flow, provided by GIF. Possible to use other custom workflow with the approval of Etherisc team.
3.	Formulate risk and pricing model and describe parameters.
    FlightDelay checks last 10 flights per particular flight number, describes weight pattern, sets up maximum accumulated weighted premium per risk.
4.	Specify risk structure. Add all the required parameters to describe Insurance Product risk structure.
    FlightDelay has specific parameters: carrierFlightNumber; departureTime; arrivalTime; delayInMinutes; delay; cumulatedWeightedPremium; premiumMultiplier; weight. This is the essence of policy agreement. 
5.	Set up events for Insurance Product.
    FlightDelay sets up the following events: 
     * LogRequestFlightStatistics - requesting data on flight statistics per fight number.
     * LogRequestFlightStatus - requesting flight status data (arrival time and flight number).
     * LogRequestPayout - requesting payout data. 
6.	Request metadata.
    Structure to understand bounds between policyId, applicationId, riskId. Possible to extend structure.
7.	Call function applyForPolicy.
    FightDelay described here domain specific data all filled by customer on UI, premium structure and external customer Id.Function validates input parameters.
8.	Call function flightStatisticsCallback.
    FlightDelay app gets a callback with flight statistics, evaluates statistics data, underwites application, emits LogRequestFlightStatus event.
9.	Call function flightStatusCallback.
    FlightDelay app gets a callback with flight status, checks if it the requested data confirms risk event and creates a claim, then payout and specifies amount of payout.
10.	Call function confirmPayout.
    Payout confirmation with payoutId and payoutAmount.

