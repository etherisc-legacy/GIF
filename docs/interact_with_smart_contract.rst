.. _rst_table_of_contents:

Interact with the smart contract
********************************

Send artifacts of your deployment to GIF Sandbox:

::

    cd ./cli
    ./bin/run artifact:send --file ./build/contracts/EStoreInsurance.json --network development


After that, the product will be approved automatically and you can start interacting with it. 
Enter the console mode:

::

    ./bin/run console


Run these commands one by one to go through the whole policy lifecycle from application creation to policy payout.

First of all, execute this command. If your product is approved, you will get information about it.

::

    gif.product.get()


Create a new customer. This data is private and available only to the product owner.

::

    gif.customer.create({ firstname: "Jow", lastname: "Dow", email: "jow@dow.com" })


Now start a new business process.

::

    gif.bp.create({ customerId: "GET-CUSTOMER-ID-FROM-PREV-COMMAND" })


Here is how you can call your contract data:

::

    gif.contract.call("EStoreInsurance", "getQuote", [100])


Now let’s apply for a policy:

::

    gif.contract.send("EStoreInsurance", "applyForPolicy", [ "APPLE", "A1278", "2012", 1000, 100, "EUR", "PUT-BP-KEY-HERE"])


Check if it is created:

::

    gif.application.getById(1)
    gif.application.list()


Underwrite the application. A new policy should be issued.

::

    gif.contract.send("EStoreInsurance", "underwriteApplication", [1])


Check the new policy:

::

    gif.policy.getById(1)
    gif.policy.list()


Create a claim for the policy:

::

    gif.contract.send("EStoreInsurance", "createClaim", [1])


Check the claim:

::

    gif.claim.getById(1)
    gif.claim.list()


Confirm the claim. A new payout should be created.

::

    gif.contract.send("EStoreInsurance", "confirmClaim", [ 1, 1 ])


Check the payout status:

::

    gif.payout.getById(1)
    gif.payout.list()


As soon as we use fiat payments here, the external payout should be confirmed. Let’s do it.

::

    gif.contract.send("EStoreInsurance", "confirmPayout", [ 1, 100 ])


And check the final payout status:

::

    gif.payout.getById(1)
    gif.payout.list()


Congratulations!) You have just built your first insurance product!
