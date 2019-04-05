module.exports = {
  'gif.info': {
    annotation: 'Information about the product',
  },
  'gif.help': {
    annotation: 'Get information about the command',
    details: `
       Arguments:
          - command (required)
       E.g. gif.help('customer.create')  
    `,
  },
  'gif.artifact.get': {
    annotation: 'Get artifact for contract',
    details: `
       Arguments:
          - contractName (required)
       E.g. gif.artifact.get('MyContract')
    `,
  },
  'gif.contract.send': {
    annotation: 'Send transaction to contract',
    details: `
      Arguments:
        - contractName (required)
        - methodName (required)
        - parameters (array, required)
      E.g. gif.contract.send('MyContract', 'applyForPolicy', [1, 2, 3])
    `,
  },
  'gif.contract.call': {
    annotation: 'Call contract',
    details: `
      Arguments:
        - contractName (required)
        - methodName (required)
        - parameters (array, required)
      E.g. gif.contract.call('MyContract', 'getQuote', [1, 2, 3])    
    `,
  },
  'gif.customer.create': {
    annotation: 'Create customer',
    details: `
      Arguments:
        - firstname (required)
        - lastname (required)
        - email (required)
        - optional_fields
      E.g. gif.customer.create({ firstname: 'Jow', lastname: 'Dow', email: 'example@email.com', age: 25 })
    `,
  },
  'gif.customer.getById': {
    annotation: 'Get customer by id',
    details: `
      Arguments:
        - id (required)
      E.g. gif.customer.getById('eef381f42a369f42dd725c6a7cc8905');
    `,
  },
  'gif.customer.list': {
    annotation: 'Get all customers',
    details: `
      E.g. gif.customer.list()
    `,
  },
  'gif.bp.create': {
    annotation: 'Create new business process',
    details: `
      Arguments:
        - customerId or customer (required)
        - optional_fields
      E.g. gif.bp.create({ customer: { firstname: 'Jow', lastname: 'Dow', email: 'example@email.com', age: 25 } })
      E.g. gif.bp.create({ customerId: 'eef381f42a369f42dd725c6a7cc8905' })
    `,
  },
  'gif.bp.getByKey': {
    annotation: 'Get business process by key identifier',
    details: `
      Arguments:
        - key (required)
      E.g. gif.bp.getByKey('eef381f42a369f42dd725c6a7cc8905')    
    `,
  },
  'gif.bp.getById': {
    annotation: 'Get business process by id identifier',
    details: `
      Arguments:
        - id (required)
      E.g. gif.bp.getById(1)
    `,
  },
  'gif.bp.list': {
    annotation: 'Get all business processes',
    details: `
      E.g. gif.bp.list()
    `,
  },
  'gif.application.getById': {
    annotation: 'Get application by id',
    details: `
      Arguments:
        - id (required)
      E.g. gif.application.getById(1)
    `,
  },
  'gif.application.list': {
    annotation: 'Get all applications',
    details: `
      E.g. gif.application.list()
    `,
  },
  'gif.policy.getById': {
    annotation: 'Get policy by id',
    details: `
      Arguments:
        - id (required)
      E.g. gif.policy.getById(1)
    `,
  },
  'gif.policy.list': {
    annotation: 'Get all policies',
    details: `
      E.g. gif.policy.list()
    `,
  },
  'gif.claim.getById': {
    annotation: 'Get claim by id',
    details: `
      Arguments:
        - id (required)
      E.g. gif.claim.getById(1)
    `,
  },
  'gif.claim.list': {
    annotation: 'Get all claims',
    details: `
      E.g. gif.claim.list()
    `,
  },
  'gif.payout.getById': {
    annotation: 'Get payout by id',
    details: `
      Arguments:
        - id (required)
      E.g. gif.payout.getById(1)
    `,
  },
  'gif.payout.list': {
    annotation: 'Get all payouts',
    details: `
      E.g. gif.payout.list()
    `,
  },
  'gif.product.get': {
    annotation: 'Get product instance',
    details: `
      E.g. gif.product.get()
    `,
  },
};
