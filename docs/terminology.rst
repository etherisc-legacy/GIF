.. _rst_table_of_contents:

###############################################
User Manual for the Generic Insurance Framework
###############################################

Terminology
###########

Below, you will find a glossary of the technical terms used in this document.

**Actor.** 
    Any participant of the DIP that uses the ecosystem to perform an activity on it (e.g., a product, a product owner, an oracle owner, the instance operator, etc.).

**Application.**
    Data applied by a customer requesting an insurance policy. An application is the predecessor of a policy. Not to be confused with software application; in our context we avoid the term "application" in this sense.

**Claim.**
    Data related to an insurance claim, which requires approval.

**Decentralized Insurance Platform (DIP).**
    An ecosystem supported by the DIP Foundation that unites product builders, risk pool keepers, resellers, oracle providers, claim adjusters, relayers, and underwriters.

**Decentralized Insurance Protocol (DIP Protocol).**
    A set of standards, rules, templates and definitions which define the interaction of participants in the ecosystem.

**Generic Insurance Framework (GIF).**
    A combined codebase, which includes smart contracts and utility services (core smart contracts and microservices) provided by the DIP Foundation and partners. The codebase can be extended by product-specific smart contracts and microservices created by product builders. Using this framework, product builders can develop full-featured DApps.

**GIF instance.** A deployed set of core smart contracts, operated by an instance operator, in most cases together with an appropriate set of utility services. A GIF instance is essentially an "Insurance as a Service (IaaS)".

**Instance operator.** An Ethereum account which operates an instance of the GIF. An instance operator can be a decentralized organization (DAO) or a single account owned by some legal entity.

**Metadata.**
    A shared object between all the objects of a particular policy flow.

**Oracle.**
    A service used to provide information to smart contracts from external resources, confirm certain events, and deliver particular data to a product.

**Oracle owner.**
    An Ethereum account registered on the DIP with a set of permissions for creating oracles and oracle types and performing operations on them.

**Oracle type.**
    A type of request to an oracle containing attributes that describe a request and respond to it. Oracles join an oracle type.

**Payout.**
    Data related to the expected and actual payout for a claim.

**Policy.**
    Technical representation of the legal agreement between a policy buyer and a carrier.

**Policy flow.**
    A core smart contract that represents a workflow of insurance policy life cycle, involving such steps as application underwriting, risk assessment, claim review, and payouts.

**Policy token.**
    A ERC1521 token (extension of a ERC 721 NFT Token), which represents a policy as a set of particular fields.

**Product.**
    A registered smart contract with permissions to create and manage policy flows.

**Product owner.**
    An Ethereum account registered on the GIF with a set of permissions allowing to create and manage product contracts and oracle types.
