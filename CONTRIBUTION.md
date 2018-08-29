# DIP Platform Contribution Guide

### Micro-service requirements
* All instances need to be able to run in a standardized **dev**, **production** and **test** modes.
* All external dependencies ( such as DB connections, MQ broker addresses, and so on) need to be configured through 
optional environment variables. 

### GIT: commits, branches and pull requests
* The commit message should ideally follow the following template:
    > [GENIT-#] a brief description of the changes ( a list of names for affected microservices )
* If the commits for one Task-tracker issue are following one another - they should ideally be squashed into one before being merged into master
