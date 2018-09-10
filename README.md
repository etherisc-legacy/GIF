# DIP Platform Readme

###### Documentation
![documentation-badge](https://img.shields.io/badge/Documentation-6.19%25%20%287%2F113%29-red.svg)

* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

### Installing the platform locally

1. Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Make sure `kubectl` 
is the latest version.
2. Running locally for the first time:
    > minikube start  
    >
    > minikube dashboard
    * This last command opens a Kubernetes control dashboard for your minikube. 
    Note that the IP is new each time you restart minikube. You can get it at any time by running `minikube ip`.
    Keep it handy for all other ports we'll potentially expose later on in the process.
3. Setting up RabbitMQ    
    * Navigate to a project root directory
         > kubectl apply -f service/rabbitmq_rbac.yaml
         >
         > kubectl apply -f service/rabbitmq_statefulsets.yaml
    * That will create a cluster of rabbitmq pods. By navigating to a `<minikubeip>:31672` in your browser you can
    open RabbitMQ's management plugin. The default administrative credentials are `guest/guest`.
4. Deploying microservices    
    * To be able to work with the docker daemon use `eval $(minikube docker-env)` in 
    every console you use to dockerize microservices for minikube. 
    * For all the microservice folders, run in this same console:
        > docker build -f Dockerfile.< MICROSERVICE NAME > -t '< MICROSERVICE NAME >:< MICROSERVICE VERSION >' .
        >
        > \# As microservice name and version appearing in the global `deployment.yaml`
    * To deploy microservices, run their respective deployment scripts:
        > kubectl apply -f microservices/< MICROSERVICE NAME >/deployment.yaml
    * To check whether the pods were created:
    
              kubectl get pods --show-labels    
              kubectl describe pod < pod name >
              kubectl logs < pod name >
    * For the front-end services, the deployments should ideally be accompanied by services exposing node-ports outward.
    But to forward the ports so deployment port interfaces are available from your local environment, run
        > kubectl port-forward deployment/< DEPLOYMENT NAME> 8080:8080 8081:8081
        >
        > `Final param is a list of space-delimetered port pairs going local:minikube`
5. Updating microservices. 
    * After you commit a new version of the microservice, you just need to build a new image and change the 
      `deployment.yaml` file to reference the new tag, along with any other changes you may need ( env vars, number of replicas). 
      Running `kubectl apply -f ./deployment.yaml` will update the service. 
