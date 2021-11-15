# DIP Platform

###### Documentation

* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

<<<<<<< HEAD
## Setup environments

### A. Setup local development environment
1. Install [Docker](https://docs.docker.com/install/#supported-platforms).
2. Install [NodeJS](https://nodejs.org/en/). NodeJs version should be >= 11, npm >= 6.
3. `npm ci` to install package dependencies
4. `npm run bootstrap` to install dependencies for Lerna packages
5. `npm run dev:services:run` to run Docker Compose with RabbitMQ and PostreSQL
6. `npm run migrate` to run migrations. Optionally, you can run `npm run seed` to fill the databases with test data, where applicable.
7. Many individual packages in `app_microservices` and `core_microservices` are configured by the files called `.env` that contain values for environment variables that a package expects to be present in the cloud environment. Where possible, bootstrap script from step 4 fills the defaults in from `.env.sample`, but developers are free to modify `.env` files as appropriate. 
8. `npm run dev` to start applications.
9. `npm login` login into npm account with access to @etherisc organization private packages.
10. `npm run publish` to update NPM packages

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

4. `NPM_TOKEN=<token> npm run deploy:minikube` to deploy to Minikube. To get the token sign in to npm and create token of type Publish on `https://www.npmjs.com/settings/etherisc_user/tokens/create`.

#### Notes
- By navigating to a `<minikubeip>:31672` in your browser you can open RabbitMQ's management plugin. The default administrative credentials are `admin/guest`.

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
3. `NPM_TOKEN=<token> npm run deploy:docker` 

The deploy script will prompt you for values you'd like your environment to have configured in Secrets. 
Some of them have default values pre-configured.

#### Notes
- All the notes for minikube deployment apply, but in case of local docker setup, <minikubeip> will need to be replaced with `localhost`

- To connect to cluster service with a local management / edit tool, you'd need to start a port-forwarding process:
    > kubectl port-forward svc/**service name** **(port that will be available to you locally)**:**(service port)**
  
  For example: 
    > kubectl port-forward svc/postgres 5432:5432  
    
### C. Setup local development environment for deployment to GKE clusters
1. Install and set up [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install and initialize [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)
3. Create account / login to [Google Cloud Platform Console](https://console.cloud.google.com)
4. In GCP dashboard navigate to Kubernetes Engine > Clusters and create new cluster
5. In the description of the newly created cluster, find and click the "connect" button and run the generated command in the local console you are going to use for deploy.
6. `npm install` to install package dependencies
7. `gcloud auth configure-docker --quiet` to authorize to Google Registry
8. `GCLOUD_PROJECT_ID=<project name> GCLOUD_CLUSTER=<cluster name> GCLOUD_ZONE=<cluster zone> NPM_TOKEN=<token> npm run deploy:gke` to deploy to GKE cluster.  To get the token sign in to npm and create token of type Publish on `https://www.npmjs.com/settings/etherisc_user/tokens/create`.

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

## Manually switching between `kubectl` contexts ( existing deployments )
To add context for already existing cluster to your local `kubectl`, use [this guide](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl).

The following command will show all the configured environments:
    > kubectl config get-contexts

To switch the kubectl context between environments:
    > kubectl config use-context <contextname>
   
Note: do not switch contexts during deploy, since the next kubectl instruction will apply to the new active context instead of the one you started the deploy with.
=======
>>>>>>> sandbox
