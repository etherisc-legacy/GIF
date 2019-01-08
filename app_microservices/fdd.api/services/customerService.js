const sha256 = require('js-sha256');

/**
 * Customer service
 */
class CustomerService {
  /**
   * constructor
   * @param {*} param0
   */
  constructor({ customerRepo, DB_SALT, CUSTOMER_ADMIN_ADDRESS }) {
    this.customerRepo = customerRepo;
    this.DB_SALT = DB_SALT;
    this.CUSTOMER_ADMIN_ADDRESS = CUSTOMER_ADMIN_ADDRESS;
  }

  /**
   * Create a customer with system eth address
   * @param {*} param0
   * @return {string}
   */
  async createWithSystemEthAddress({ firstName, lastName, email }) {
    const { DB_SALT, CUSTOMER_ADMIN_ADDRESS } = this;

    const customerId = sha256(firstName + lastName + email + DB_SALT).slice(0, 31);
    const ethereumAccount = CUSTOMER_ADMIN_ADDRESS;
    await this.getOrCreateCustomer({
      firstName,
      lastName,
      email,
      customerId,
      ethereumAccount,
    });

    return customerId;
  }

  /**
   * Create a customer
   * @param {*} param0
   * @return {{}}
   */
  create({
    firstName,
    lastName,
    email,
    ethereumAccount,
  }) {
    const { DB_SALT } = this;

    const sha = sha256(firstName + lastName + email + DB_SALT);
    const customerId = sha.slice(0, 31);
    const newCustomer = {
      customerId,
      firstName,
      lastName,
      email,
    };

    if (ethereumAccount) {
      newCustomer.ethereumAccount = ethereumAccount;
    }

    return this.getOrCreateCustomer(newCustomer);
  }

  /**
   * Get or create a customer
   * @param {*} newCustomer
   * @return {{}}
   */
  async getOrCreateCustomer(newCustomer) {
    const { customerRepo } = this;
    const { customerId } = newCustomer;

    const exists = await customerRepo.exists(customerId);

    if (exists.length === 0) {
      await customerRepo.create(newCustomer);

      return { customerId };
    }

    return { customerId: exists[0].customerId };
  }
}

module.exports = CustomerService;
