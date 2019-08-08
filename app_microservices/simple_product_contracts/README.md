## Using this sample Product for `gifcli` testing.

1. Check the contract address for your sandbox implementation's `ProductService` For existing deployments, it needs to be provided by the administrators.
For local installations of dip_platform, you'd need to access the database or read some logs:
    - Checking the database: Check table `contracs` in the `event_listener` schema.
    - Checking the logs: Call `kubectl logs {{event listener pod name}} | grep "platform ProductService"`  
    
2. Deploy the Product contracts.
    - > export NETWORK_NAME=rinkeby HTTP_PROVIDER=... MNEMONIC=... GIF_PRODUCT_SERVICE_CONTRACT=...
    - > cd .../simple_product_contracts
    - > PRODUCT_NAME='{{ your product name }}' npm run migrate -- --reset --network rinkeby

3. It takes some time for `event_listener` to detect new product being deploye and added to `ProductService`
    - If you  try and use `gifcli` to send artifacts, it might return an error `Contract not registered on Ethereum in GIF service contract`
    - If you have database access, you may check if the event was successful - table `products` in the `policy_storage` schema shall eventually contain the `PRODUCT_NAME` you specified

4. Configure `gifcli` to work with the dip_platform environment you use. For a local testing, the following env variables need to be set:
    - export GIF_AMQP_HOST="localhost" GIF_API_HOST="http://localhost" GIF_AMQP_PORT=5672 GIF_API_PORT=4001
    
5. Send artifact contract through `gifcli`
    - > ./cli/bin/run product:create  (enter your chosen product name)
    - > ./cli/bin/run product:select
    - >  ./cli/bin/run artifact:send --file ./app_microservices/simple_product_contracts/build/SimpleProduct.json --network rinkeby
