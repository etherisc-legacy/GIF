### Useful commands

Both in development, and in k8s, the license_manager api is exposed on port 4001.

> export PLATFORM_HOST={ http://localhost | cluster IP }

> curl -X POST -d firstname=... -d password=... -d email=... -d lastname=... $PLATFORM_HOST:4001/api/users
> * Response: {"token": string , "id": integer}

> curl -X POST -d password=... -d { email=... | id=... } $PLATFORM_HOST:4001/api/users/login
> * Response: {"token": string , "id": integer}

> export JWT_TOKEN={ token }

> curl -X POST -d name=$NEW_PRODUCT_NAME -H "Authorization: Bearer $JWT_TOKEN" $PLATFORM_HOST:4001/api/products 

> curl -H "Authorization: Bearer $JWT_TOKEN" $PLATFORM_HOST:4001/api/products
