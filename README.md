# DIP Platform Readme

* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

### Installing the platform locally

1. Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Make sure `kubectl` 
is the latest version.
2. Running locally for the first time:
    > minikube start
    * To be able to work with the docker daemon use `eval $(minikube docker-env)` in 
    every console you use to dockerize microservices for minikube. 
    * Navigate to a project root directory
    * For all the microservice folders, run in this same console:
        > docker build < FOLDER PATH > -t '< MICROSERVICE NAME >:< MICROSERVICE VERSION >'
        >
        > \# As microservice name and version appearing in the global `deployment.yaml`
    * To deploy, run:
        > kubectl create -f deployment.yaml
    * To check whether the pods were created:
    
              kubectl get pods --show-labels    
              kubectl describe pod < pod name >
              kubectl logs < pod name >
    * To forward the ports so deployment port interfaces are available from your local environment, run
        > kubectl port-forward deployment/dip-platform-deployment 8080:8080 8081:8081
        >
        > `Final param is a list of space-delimetered port pairs going local:minikube`

