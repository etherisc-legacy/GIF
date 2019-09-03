.. _rst_table_of_contents:

The idea for a new product
==========================

In this article, we will build a very simple product. The main goal is to provide you a path through the process of building your own product. In this case, we will build an insurance product for an electronic store, which sells screens for laptops.

Let’s assume that a screen is unrepairable. If it’s broken (and of course only if it is an insurance case), a payout should be equal to the price of the screen.

The pricing model is very simple. Let’s assume that a policy premium should be 10% of the laptop screen price.

The policy expiration period is 1 year.

The following actors will take part in the process: an application manager, an underwriter, a claims manager and a bookkeeper.

Here are the steps of the product life cycle:

- The customer applies for a policy.

- The application manager creates an application for the policy on behalf of the customer.

- The underwriter underwrites or declines the application.

- If the application is underwritten, a new policy is issued.

- If something wrong happens with the laptop screen, the customer can create a claim.

- The claims manager confirms or declines this claim.

- If the claim is confirmed, a new payout is created.

- Then, the bookkeeper should pay to the customer and confirm that the payout has been executed.

- After the expiration period ends, the policy should be expired.


Setting up a development environment
====================================

Prerequisites:
**************

`Node.js <https://nodejs.org/en/>`_ should be installed on your computer. If you already have it, then check its version. It shouldn’t be too old. Use at least version 8.12.0 but below 12 (to see if Node.js is installed, open your terminal and type "node -v", this should show you a current version).

GIF consists of 3 parts:

- **Core smart contracts**

- **Microservices** represent a utility layer. They are available to provide useful functionality for product builders (off-chain data storage, watch Ethereum events, interact with smart contracts (call data and send transactions), send emails, telegram notifications, etc.). More detailed information about available microservices will be published in the next articles.

- **CLI tool (gifcli)**. A command-line interface to interact with the sandbox environment.

Registration
************

In order to create products, you have to be registered as a product owner. Use the "./bin/run user:register" command to register in the sandbox. It will require to insert some information: first name, last name, email, and password.

Prepare environment variables, like this and put them to your shell env file (e.g. .bashrc, .zshrc, etc.):

::

    export GIF_API_HOST="http://localhost"
    export GIF_AMQP_HOST="localhost”
    cd ./cli
    ./bin/run user:register


After the registration, the product owner is permitted to create a product. Let’s create the first one.

::

    ./bin/run product:create


That’s it. Now we can start creating a smart contract for the product.
