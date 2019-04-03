module.exports = {
  info: `
    Information about the product
  `,
  help: `
    Get information about the command:
      - command (required)
    E.g. gif.help('customer.create')  
  `,
  'artifact.get': `
    Get artifact for contract:
      - contractName (required)
    E.g. gif.artifact.get('MyContract')  
  `,
  'artifact.send': `
    Send artifact for contract:
      - params (required)
        - params.network (required)
        - params.networkId (required)
        - params.artifact (required)
        - params.version (reguired)
    E.g. gif.artifact.send({ network: 'rinkeby , networkId: 4, artifact: {...}, version: '1.0.0' })  
  `,
  'contract.send': `
    Send transaction to contract
      - contractName (required)
      - methodName (required)
      - parameters (array, required)
    E.g. gif.contract.send('MyContract', 'applyForPolicy', [1, 2, 3]) 
  `,
  'contract:call': `
    Call contract
      - contractName (required)
      - methodName (required)
      - parameters (array, required)
    E.g. gif.contract.send('MyContract', 'getQuote', [1, 2, 3]) 
  `,
  'customer.create': `
    Create customer:
      - firstname (required)
      - lastname (required)
      - email (required)
      - optional_fields
    E.g. gif.customers.create({ firstname: 'Jow', lastname: 'Dow', email: 'example@email.com', age: 25 })  
  `,
  'customer.getById': `
    Get customer by id:
      - id (required)
    E.g. gif.customers.getById('eef381f42a369f42dd725c6a7cc8905');  
  `,
  'customer.list': `
    Get all customers:
    E.g. gif.customers.list()
  `,
  'bp.create': `
    Create new business process
      - customerId or customer (required)
      - optional_fields
    E.g. gif.bp.create({ customer: { firstname: 'Jow', lastname: 'Dow', email: 'example@email.com', age: 25 } )  
    E.g. gif.bp.create({ customerId: 'eef381f42a369f42dd725c6a7cc8905' )  
  `,
  'bp.getByKey': `
    Get business process by key identifier:
      - key (required)
    E.g. gif.bp.getByKey('eef381f42a369f42dd725c6a7cc8905')  
  `,
  'bp.getById': `
    Get business process by id identifier:
      - id (required)
    E.g. gif.bp.getByKey(1)  
  `,
  'bp.list': `
    Get all business processes:
    E.g. gif.bp.list()
  `,
  'application.getById': `
    Get application by id:
      - id (required)
    E.g. gif.application.getById(1)  
  `,
  'application.list': `
    Get all applications:
    E.g. gif.application.list()
  `,
  'policy.getById': `
    Get policy by id:
      - id (required)
    E.g. gif.policy.getById(1)     
  `,
  'policy.list': `
    Get all policies:
    E.g. gif.policy.list()
  `,
  'claim.getById': `
    Get claim by id:
      - id (required)
    E.g. gif.claim.getById(1)   
  `,
  'claim.list': `
    Get all claims
    E.g. gif.claim.list()
  `,
  'payout.getById': `
      Get payout by id:
      - id (required)
    E.g. gif.payout.getById(1) 
  `,
  'payout.list': `
    Get all payouts:
    E.g. gif.payout.list()
  `,
  'product.get': `
    Get product instance:
    E.g. gif.getProduct()
  `,
};
