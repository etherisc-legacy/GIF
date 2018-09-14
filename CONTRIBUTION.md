# DIP Platform Contribution Guide

### Micro-service requirements
* All instances need to be able to run in a standardized **dev**, **production** and **test** modes.
* All external dependencies ( such as DB connections, MQ broker addresses, and so on) need to be configured through 
optional environment variables. 

### MQ messages format and processing
Each microservice should include a shared message registry reference.

The following attributes are universally passed along with the payload of the message:
*  correlationId - an UUIDv4 identifier for the message chain. It should be either generated in the sender, or if 
    the message is a response for the other one - passed along with the results.
* Header data. Needs to have `originatorName` and `originatorVersion` specified for book-keeping, but potentially 
    allows for other free-form fields (unlike the parameters root)
    
### Using shared libraries between microservices
* [Lerna](https://github.com/lerna/lerna) in an independent mode is used to manage independently versioned packages
* Because we use a monorep setup with microservices which are each bundled into a Docker image, we had to employ Lerna 
during `docker build` as well - dockerfiles for individual microservices are stored in the repo root so building them as 
access to both microservices and shared files.


### GIT: commits, branches and pull requests
* The commit message should ideally follow the following template:
    > [GENIT-#] a brief description of the changes ( a list of names for affected microservices )
* If the commits for one Task-tracker issue are following one another - they should ideally be squashed into one before being merged into master

### Documentation
* Esdoc is used to generate documentation
* Javascript files should be documented with JSDoc syntax [JSDdoc](http://usejsdoc.org/)
* Use `npm run docs` to generate docs
