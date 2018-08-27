# DIP Platform Readme

* [Contribution guidelines](CONTRIBUTION.md)
* [License](LICENSE)

### Installing the platform locally

1. Install [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/). Make sure `kubectl` 
is the latest version.
2. Run
    > minikube start
    * To be able to work with the docker daemon use `eval $(minikube docker-env)` afterwards. 








> kubectl run kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1 --port=8080
