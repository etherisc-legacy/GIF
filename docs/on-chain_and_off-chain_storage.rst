.. _rst_table_of_contents:

On-chain and off-chain storage
==============================
Any Product on the DIP has a choice of:

- what type of data to store
- where to store data

The DIP storage model allows products contracts to store its data on: 

- blockchain smart contracts
- a platform database
- a product database

.. note:: Payment card data should be stored on a payment provider level as it requires PCI compliance to store payment card data of customers in a database.

In many countries, a legal agreement is needed between a party that runs a storage service and a party that uses a storage service.

On-chain
--------
As the DIP operates in the Ethereum environment, the term **on-chain** specifies smart contracts, where a product can store risk description and specific metadata per policy.

The key principle of how the DIP itself uses data is that no personal data is kept in smart contracts—only **unique hashed references**.

The DIP allows to store data for any product regarding its:

- customers (**Note:** *first_name, last_name,* and *e-mail* fields are required by the GIF.)

- policies

- claims

In case a product doesn't want to use a platform database, it is possible to use the product’s database.

.. attention:: 

    According to the EU General Data Protection Regulation requirements, we prevent you from storing personal data of customers on-chain. This data is to be stored **off-chain only**. There exist special identificators stored on-chain (hashed data references), which allow for retrieving data from an off-chain database. This prevents unauthorized access to sensitive data by an on-chain identificator. The diagram below illustrates the relations between on-chain and off-chain storage. This methodology implements the `"Positionspapier des Bundesblock," <https://bundesblock.de/wp-content/uploads/2017/10/bundesblock_positionspapier_v1.1.pdf>`_ the german association of blockchain companies which tries to implement this methodology in EU law.

.. image:: gdpr.jpeg
    :scale: 100 %
    :align: center
    :alt: general data protection requirements

Profiling
---------
To avoid the possibility of the so-called customer "profiling," each newly issued policy gets a new unique customer ID (unique hashed reference).

Make Payouts
============
In order to make payouts, a product contract can use the GIF **Payout** microservice. A product contract has two possible ways to be informed about the payout needed.

In the **first way**, a product contract can sign up to the **statusChanged** event from a policy storage to be notified when a payout is needed. The microservice gets a message from a smart contract and sends it to a product application, which needs to provide a payout.

The **second way** implies that a product contract can sign up to the **Event Listener** and read events about its contracts.

The GIF **Payout** microservice doesn't have any business logic implementation regarding where to transfer payout funds and which way (transferring to a bank account, payment cards, a transferwise, paypal accounts, coin wallets, post transfers, etc.). This business logic could be implemented by a product contract.

Below, you will find an example of a payout event, which has to be sent by a product contract.

.. code-block:: solidity
   :linenos:

    {
    policyId: 1,
    payoutAmount: 100,
    currency: 'EUR',
    provider: 'transferwise',
    }
