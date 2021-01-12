/* eslint-disable no-console */

const { connect } = require('./index');

/**
 *
 * @return {Promise<void>}
 */
async function main() {
  const gif = await connect();

  const product = await gif.product.get();

  console.log('Product:', product);

  /**
   * Create new customer
   */
  const customer = await gif.customer.create({
    firstname: 'Jow',
    lastname: 'Dow',
    email: 'jow@gmail.com',
  });

  console.log('Customer:', customer);

  /**
   * Create new business process
   */
  const businessProcess = await gif.bp.create({
    customerId: customer.customerId,
  });

  console.log('Business process:', businessProcess);

  /**
   * Get quote
   */
  const price = 1000;
  const quote = await gif.contract.call('EStoreInsurance', 'getQuote', [price]);

  console.log('Quote', quote);

  /**
   * Apply for policy
   */
  const applyTx = await gif.contract.send('EStoreInsurance', 'applyForPolicy', [
    'APPLE', 'A1278', '2012', price, quote._premium, 'EUR', businessProcess.bpExternalKey,
  ]);

  console.log('Apply for policy', applyTx);

  const applicationId = parseInt(applyTx.events.LogRequestUnderwriter.returnValues.applicationId._hex, 16);

  console.log('ApplicationId:', applicationId);

  // Wait database sync
  await new Promise(resolve => setTimeout(resolve, 10000));
  const application = await gif.application.getById(applicationId);

  console.log('Application:', application);

  /**
   * Get all applications
   */
  const applications = await gif.application.list();
  console.log('All applications:', applications);

  /**
   * Close connection
   */
  await gif.shutdown();
}

main().catch(console.error);
