# DIP Platform Readme

###### Documentation
![documentation-badge](https://img.shields.io/badge/Documentation-5.69%25%20%287%2F123%29-red.svg)

* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

## Setup environments

### A. Setup local development environment
1. Install [Docker](https://docs.docker.com/install/#supported-platforms).
2. Install [NodeJS](https://nodejs.org/en/). NodeJs version should be >=6 && < 10.
3. `npm install` to install package dependencies
4. `npm run bootstrap` to install dependencies for Lerna packages
5. `npm run dev:system_microservices:run` to run Docker Compose with RabbitMQ and PostreSQL
6. `npm run dev` to start applications.
7. `./node_modules/.bin/lerna publish` to publish packages to NPM

### B. Setup local development e2e test environment
1. Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Make sure `kubectl` is the latest version.
2. Run Minikube:

    `minikube start` will start Minikube
    
    `minikube ip` will return local Minikube IP
    
    `minikube dashboard` will open Minikube dashboard for local Kubernetes cluster
    
    `minikube delete` will delete Minikube cluster

    Note that the IP is new each time you restart minikube. You can get it at any time by running `minikube ip`.
    Keep it handy for all other ports we'll potentially expose later on in the process.
3. `npm install` to install package dependencies
4. `npm run bootstrap` to install dependencies for Lerna packages
5. `./bin/rin deploy` to deploy to Minikube

#### Notes
a. By navigating to a `<minikubeip>:31672` in your browser you can open RabbitMQ's management plugin. The default administrative credentials are `guest/guest`.

b. To check whether the pods were created:

`kubectl get pods --show-labels`

`kubectl describe pod <pod name>`

`kubectl logs <pod name>`

c. For the front-end services, the deployments should ideally be accompanied by services exposing node-ports outward. 
But to forward the ports so deployment port interfaces are available from your local environment, run:

`kubectl port-forward deployment/< DEPLOYMENT NAME> 8080:8080 8081:8081`

Final param is a list of space-delimetered port pairs going local:minikube.
    
    
### C. Setup local development environment for deployment to GKE clusters
1. Install and set up [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install and initialize [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)
3. Create account / login to [Google Cloud Platform Console](https://console.cloud.google.com)
4. In GCP dashboard navigate to Kubernetes Engine > Clusters and create new cluster
5. Click "connect" button and run proposed command.
3. `npm install` to install package dependencies
4. `npm run bootstrap` to install dependencies for Lerna packages
5. `GCLOUD_PROJECT=<project name> GCLOUD_CLUSTER=<cluster name> GLOUD_ZONE=<cluster zone> NODE_ENV=production ./bin/rin deploy` to deploy to GKE cluster

### D. Setup deployment to GKE clusters from Bitbucket Pipelines CI

#### Setup Google Cloud
1. Create account / login to [Google Cloud Platform Console](https://console.cloud.google.com)
2. Select or create a GCP project ([manage resources page](https://console.cloud.google.com/cloud-resource-manager))
3. Make sure that billing is enabled for your project ([learn how](https://cloud.google.com/billing/docs/how-to/modify-project))
4. Enable the App Engine Admin API ([enable APIs](https://console.cloud.google.com/flows/enableapi?apiid=appengine))

#### Create Kubernetes cluster
1. In GCP dashboard navigate to Kubernetes Engine > Clusters
2. Create new cluster

##### Creating authorization credentials for Bitbucket
Create an App Engine service account and API key. Bitbucket needs this information to deploy to App Engine.
1. In the Google Cloud Platform Console, go to the [Credentials](https://console.cloud.google.com/apis/credentials) page.
2. Click Create credentials > Service account key.
3. In the next page select Compute Engine default service account in the Service account dropdown.
4. Click the Create button. A copy of the JSON file downloads to your computer. (This is your JSON credential file)

##### Configure the environment variables required by the pipeline script
Open up your terminal and browse to the location of your JSON credential file from earlier. Then run the command below to encode your file in base64 format. Copy the output of the command to your clipboard.

`base64 <your-credentials-file.json>`

Go to your repository settings in Bitbucket and navigate to Pipelines > Environment variables. Create a new variable named GCLOUD_API_KEYFILE and paste the encoded service account credentials in it.

Add another variable called GCLOUD_PROJECT and set the value to the key of your Google Cloud project that you created in the first step `your-project-name`.

Add GCLOUD_CLUSTER, GCLOUD_ZONE variables to specify your GKE cluster.

Use custom commands specified in bitbucket-pipelines.yml to deploy info Kubernetes cluster.
