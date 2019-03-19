.. _rst_table_of_contents:

Use Cases for Product Owners
############################
Register a product
==================
For any product that expects to perform certain actions, it is crucial to register its product contract within the GIF instance.

The registration of a product contract takes place on a smart contract level.

A product creates a contract and inherits one of the GIF contracts — a product contract. After inheriting, a product contract is able to use the GIF functions to describe its business process.

The **register** function (see the code below) is used to register a new product contract. After approval, a contract obtains access to call entry methods.

.. code-block:: solidity
   :linenos:

    function register(
    bytes32 _productName, 
    bytes32 _policyFlow
    ) external
    returns (uint256 _registrationId);

Role assignment by a product 
============================
To assign roles to specific contracts or people, role-based access control (RBAC) is used. A product contract should set up roles and specify what method can be called and by which role.

A lot depends on a business process, but there are two possible cases.

In the **first scenario**, actions can be called by people. It means a product contract may create a role, assign it to particular person, and this person will call a function (i.e., underwrite an application).

In the **second scenario**, actions perform a product contract. An oracle may respond with certain data, then a product contract will need to create a function of an oracle response handler, write certain logic, and automatically call the underwrite function.

A product owner defines necessary roles for its product contract and those who will be appointed to the created roles.

The data related to the roles is kept by a product contract. It inherits the "Product" contract and, after that, gets access to the RBAC methods. So, the roles belonging to the accounts and account data are stored in the product's account (without storage on the GIF).

The code below illustrates the contract details and function calls available.

.. code-block:: solidity
   :linenos:

    contract RBAC {
            mapping(bytes32 => uint256) public roles;
            bytes32[] public rolesKeys;
            mapping(address => uint256) public permissions;
            modifier onlyWithRole(bytes32 _role) {
                require(hasRole(msg.sender, _role));
                _;
            }
         
            function createRole(bytes32 _role) public {
                require(roles[_role] == 0);
                // todo: check overflow
                roles[_role] = 1 << rolesKeys.length;
                rolesKeys.push(_role);
            }
 
            function addRoleToAccount(address _address, bytes32 _role) public {
                require(roles[_role] != 0);
                permissions[_address] = permissions[_address] | roles[_role];
            }
  
            function cleanRolesForAccount(address _address) public {
                delete permissions[_address];
            }
 
            function hasRole(address _address, bytes32 _role)
                public
                view
                returns (bool _hasRole)
            {
                _hasRole = (permissions[_address] & roles[_role]) > 0;
            }
        }
