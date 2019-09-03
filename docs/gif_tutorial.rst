.. _rst_table_of_contents:

######################################################
GIF Tutorial: How to build an insurance product on GIF
######################################################

.. pull-quote::

    This is the first part of the GIF Tutorial aimed at explaining how to build products on top of Etherisc’s Generic Insurance Framework. In this article, we will go through all the steps of creating your very first product on top of GIF. So put your fingers on the keyboard and let’s get moving.

    First of all, what is "GIF"? The acronym stands for "Generic Insurance Framework". Its main goal is to provide a simple and clean interface to build decentralized insurance products. Core contracts are aimed to be deployed on-chain.

    A product contract acts as a client and utilizes generic methods which are important parts of every policy lifecycle. From this point of view, a product’s business logic could be defined in a single smart contract and all the hard work is delegated to the GIF.


Some insurance terminology
==========================

Before we start, let’s define some insurance-specific terminology.

- An **insurance company** is a legal body that is qualified in accepting risks against a premium. In most countries, insurance companies need a license. The insurance company is not necessarily the entity which runs the technical process; it can also be outsourced to a service provider. Most of the other functions in the value chain can also be taken by other parties (e.g. distribution, claims management, etc.). The only function which cannot be delegated is the actual transfer of the risk.

- An **application** is a formal request of the customer for an insurance policy. It is a signal from the customer to the insurance company: "I ask for insurance cover".

- The application is then checked by the insurance company and either accepted or declined. The process of accepting an application is called **underwriting**. The person who performs this action is an **"underwriter"**. By underwriting, the insurance company commits itself to transfer the risk from the customer to the insurance company. This fact is documented in a contract. This contract is called a **policy**. A contract is binding for both parties: The customer is committed to paying the premium and the insurance company is committed to covering a loss in case an insured event occurs.

- If an insured event occurs, the customer typically files a **claim** — a step which can be omitted in case of parametric insurance, where a data-driven oracle takes the responsibility to file the claim automatically.

- The claim is then checked by the insurance company and if the insurance company decides that the claim is valid then a **payout** is triggered (e.g. the insurance company will deny the claim if the premium has not been paid). Again, in a parametric case, the insurance company can delegate the decision to a rule-based engine or to an external independent oracle.

- Payouts can be done in one or more parts.

GIF provides generic functions for this lifecycle and a generic workflow which controls the sequence of states. In the next section, we will describe these functions and how they work in detail. Every function can be assigned to a **role**, which can be defined by the product designer. Typical roles are e.g. **underwriter**, **claims manager**, **application manager**, **bookkeeper** but of course the product designer is not limited to these.


Generic Lifecycle Functions
===========================

Here is the list of magic methods available for every product:

- **_register** (each product needs to be registered in order to get access to the GIF functionality)

- **_newApplication** (to put application data into the storage)

- **_underwrite** (to underwrite an application and create a new policy)

- **_decline** (to decline an application)

- **_newClaim** (to create a new claim for policy)

- **_confirmClaim** (to confirm a claim and create a payout object)

- **_declineClaim** (to decline a claim)

- **_payout** (to confirm an off-chain payout)

- **_request** (to request data or action from the oracle)

- **_createRole** (to create roles for actors)

- **_addRoleToAccount** (to assign roles to actors)

The names of these methods start with an **underscore** to highlight the fact that these are internal methods and you can override them in your product. For example, you are free to have the **newApplication** method in your contract and use **_newApplication** in it as well.
