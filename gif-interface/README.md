# Etherisc Smart Contract Interfaces
###  For building and integrating Products and Oracles with the Generic Insurance Framework GIF

#### How to use

* To build a Product which uses the GIF, you need to write a Product contract which inherits from Product.sol.
* To build an Oracle, you need to write an Oracle Contract which inherits from Oracle.sol.

Both Products and Oracles need to register with the GIF Registry, which may need approval
by the instance operator.

The Instance operator may be a centralized party or a decentralized DAO-like structure.
