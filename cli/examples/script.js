/* global gif */

/**
 * Script
 * @return {Promise<void>}
 */
async function main() {
  const { product } = gif.info();
  console.log(`Customers in product ${product}`);

  const customers = await gif.customer.list();
  console.table(customers);
}

main().catch(console.log);
