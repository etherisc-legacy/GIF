# DIP Platform

###### Documentation
![documentation-badge](https://img.shields.io/badge/Documentation-53.3%25%20%28218%2F409%29-yellow.svg)

###### Test coverage summary

Module         | % Stmts       | % Branch      | % Funcs       | % Lines
-------------- | --------------| --------------| --------------| --------------
estore_api.v1.0.0 | 0% (0/135) | 0% (0/6) | 0% (0/29) | 0% (0/135)
estore_contracts.v1.0.0 | - | - | - | -
estore_ui.v1.0.0 | 1.92% (5/261) | 0% (0/81) | 2.33% (1/43) | 2.06% (5/243)
@etherisc/etherisc_flight_delay_api.v0.1.1 | 2.38% (2/84) | 0% (0/20) | 3.33% (1/30) | 2.86% (2/70)
@etherisc/etherisc_flight_delay_ui.v0.1.1 | 35.9% (14/39) | 0% (0/4) | 30.77% (4/13) | 40% (14/35)
@etherisc/dip_artifacts_storage.v1.0.0 | 43.18% (19/44) | 50% (1/2) | 33.33% (3/9) | 48.72% (19/39)
@etherisc/dip_contracts.v1.0.0 | - | - | - | -
@etherisc/dip_ethereum_client.v0.1.1 | - | - | - | -
@etherisc/dip_event_listener.v0.1.0 | 43.18% (57/132) | 42.86% (6/14) | 44.44% (12/27) | 45.9% (56/122)
@etherisc/dip_event_logging.v0.2.0 | 45.71% (16/35) | 75% (3/4) | 54.55% (6/11) | 51.61% (16/31)
@etherisc/dip_fiat_payment_gateway.v0.1.1 | - | - | - | -
@etherisc/dip_fiat_payout_gateway.v0.1.1 | - | - | - | -
@etherisc/dip_pdf_generator.v1.0.1 | - | - | - | -
@etherisc/dip_policy_storage.v0.1.1 | 50.97% (79/155) | 62.5% (5/8) | 41.46% (17/41) | 55.24% (79/143)
postgresql-service.v1.0.0 | - | - | - | -
@etherisc/microservice.v0.4.3 | - | - | - | -
[endOfCoverageTable]: #



* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

## Setup environments

### A. Setup local development environment
1. Install [Docker](https://docs.docker.com/install/#supported-platforms).
2. Install [NodeJS](https://nodejs.org/en/). NodeJs version should be >= 11, npm >= 6.
3. `npm ci` to install package dependencies
4. `npm run bootstrap` to install dependencies for Lerna packages
5. `npm run dev:services:run` to run Docker Compose with RabbitMQ and PostreSQL
6. `npm run migrate` to run migrations. Optionally, you can run `npm run seed` to fill the databases with test data, where applicable.
7. `npm run dev` to start applications.
8. `npm login` login into npm account with access to @etherisc organization private packages.
9. `npm run publish` to update NPM packages

### B. Setup local development e2e test environment
1. Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Make sure `kubectl` is the latest version.
2. Run Minikube:
    `minikube start` will start Minikube. You may want to configure it for better performance:
    
        `minikube cache add nginx:stable`

        `minikube cache add postgres:10.5`

        `minikube cache add node:11.2.0`

        `minikube config set memory 4096`
    
    `minikube ip` will return local Minikube IP
    
    `minikube dashboard` will open Minikube dashboard for local Kubernetes cluster
    
    `minikube delete` will delete Minikube cluster

    Note that the IP is new each time you restart minikube. You can get it at any time by running `minikube ip`.
    Keep it handy for all other ports we'll potentially expose later on in the process.
3. `npm ci` to install package dependencies

4. `npm run bootstrap` to install dependencies for Lerna packages

5. `NPM_TOKEN=<token> npm run deploy:minikube` to deploy to Minikube. To get the token sign in to npm and create token of type Publish on `https://www.npmjs.com/settings/etherisc_user/tokens/create`.

#### Notes
- By navigating to a `<minikubeip>:31672` in your browser you can open RabbitMQ's management plugin. The default administrative credentials are `guest/guest`.

- `fdd.web` is available on `<minikubeip>:80`.

- `postgresql` is available on `<minikubeip>:30032`. Connections string `postgresql://dipadmin:dippassword@postgres:5432/dip`.

- To check whether the pods were created:

`kubectl get pods --show-labels`

`kubectl describe pod <pod name>`

`kubectl logs <pod name>`

- For the front-end services, the deployments should ideally be accompanied by services exposing node-ports outward. 
But to forward the ports so deployment port interfaces are available from your local environment, run:

`kubectl port-forward deployment/< DEPLOYMENT NAME> 8080:8080 8081:8081`

Final param is a list of space-delimetered port pairs going local:minikube.

#### B-2. Deploy to Minikube bundled with the local docker (alternative to setting up Minikube).
If you are a Mac user and have Docker for Mac 17.12 CE Edge and higher, or 18.06 Stable and higher. 
1. Configure [Kubernetes for Docker](https://docs.docker.com/docker-for-mac/#kubernetes)
2. `npm ci` to install package dependencies
3. `npm run bootstrap` to install dependencies for Lerna packages
4. `NPM_TOKEN=<token> npm run deploy:docker` 

The deploy script will prompt you for values you'd like your environment to have configured in Secrets. 
Some of them have default values pre-configured.

#### Notes
- All the notes for minikube deployment apply, but in case of local docker setup, <minikubeip> will need to be replaced with `localhost`
    
### C. Setup local development environment for deployment to GKE clusters
1. Install and set up [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install and initialize [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)
3. Create account / login to [Google Cloud Platform Console](https://console.cloud.google.com)
4. In GCP dashboard navigate to Kubernetes Engine > Clusters and create new cluster
5. In the description of the newly created cluster, find and click the "connect" button and run the generated command in the local console you are going to use for deploy.
6. `npm install` to install package dependencies
7. `npm run bootstrap` to install dependencies for Lerna packages
8. `gcloud auth configure-docker --quiet` to authorize to Google Registry
10. `GCLOUD_PROJECT_ID=<project name> GCLOUD_CLUSTER=<cluster name> GCLOUD_ZONE=<cluster zone> NPM_TOKEN=<token> npm run deploy:gke` to deploy to GKE cluster.  To get the token sign in to npm and create token of type Publish on `https://www.npmjs.com/settings/etherisc_user/tokens/create`.

### D. Setup deployment to GKE clusters from Bitbucket Pipelines CI

#### Setup Google Cloud
1. Create account / login to [Google Cloud Platform Console](https://console.cloud.google.com)
2. Select or create a GCP project ([manage resources page](https://console.cloud.google.com/cloud-resource-manager))
3. Make sure that billing is enabled for your project ([learn how](https://cloud.google.com/billing/docs/how-to/modify-project))
4. Enable the App Engine Admin API ([enable APIs](https://console.cloud.google.com/flows/enableapi?apiid=appengine))

#### Create Kubernetes cluster
1. In GCP dashboard navigate to Kubernetes Engine > Clusters
2. Create new cluster
3. If you deploy first time, answer `Y` when the deployment script asks you whether you want to `Set Secret variables?` in general, as well as each specific set of secrets later on.

#### Create authorization credentials for Bitbucket
Create an App Engine service account and API key. Bitbucket needs this information to deploy to App Engine.

1. In the Google Cloud Platform Console, go to the [Credentials](https://console.cloud.google.com/apis/credentials) page.

2. Click Create credentials > Service account key.

3. In the next page select Compute Engine default service account in the Service account dropdown.

4. Click the Create button. A copy of the JSON file downloads to your computer. (This is your JSON credential file)

#### Configure the environment variables required by the pipeline script
Open up your terminal and browse to the location of your JSON credential file from earlier. Then run the command below to encode your file in base64 format. Copy the output of the command to your clipboard.

`base64 <your-credentials-file.json>`

Go to your repository settings in Bitbucket and navigate to Pipelines > Environment variables. Create a new variable named GCLOUD_API_KEYFILE and paste the encoded service account credentials in it.

Add another variable called GCLOUD_PROJECT_ID and set the value to the key of your Google Cloud project that you created in the first step `your-project-name`.

Add GCLOUD_CLUSTER, GCLOUD_ZONE variables to specify your GKE cluster.

Use custom commands specified in bitbucket-pipelines.yml to deploy info Kubernetes cluster.
