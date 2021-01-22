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

### Testing
`npm run test:e2e` run end-to-end tests

`npm run test` run tests for packages

`npm run coverage` run tests coverage for packages

`npm run collect:coverage` collect tests coverage from packages in README.md

### Contributing

Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

### Copyright and Licensing

Etheriscs open source projects are licensed under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0).

Etherisc does not require you to assign the copyright of your contributions, you retain the copyright. Etherisc does require that you make your contributions available under the Apache 2.0 license in order for it be included in the main repo.

If appropriate, include the Apache 2.0 license summary at the top of each file along with the copyright info. 
We recommend to use the SPX License-identifier at the top which will silence compiler and lint warnings:
`// SPDX-License-Identifier: Apache-2.0`
If you are adding a new file that you wrote, include your name in the copyright notice in the license summary at the top of the file.

#### Apache 2.0 License Summary

You can copy and paste the Apache 2.0 license summary from below.

```
Copyright 2017-2018 by Etherisc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### Notes
Markdown syntax [examples](https://bitbucket.org/tutorials/markdowndemo/src/master/)
