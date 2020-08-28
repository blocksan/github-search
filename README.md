# Github Searcher Backend MicroService   
It is responsible to provide the endpoints which can be used by the consumer.
This service is built with NestJs framework ( express ) with Event Pattern Microservice Architecture.
Features included in this backend service
  -  **Swagger documentation** for APIs - path : ip_address/api/gitswagger
  -  **Compodoc documentation** for the whole application - path : ip_address:8000
  -  **Custom Logger service**
  -  **Custom HTTP Exception service**
  -  **Event/Message based pub-sub** channel with **REDIS microservice**
  -  **Cache and Content** details API
  -  **Request Middleware** - adds unique request Id to each request
  -  **Dockerized** container with development mode
  -  **Dockerized** container with production mode
  -  **TsDoc** based documentation for the controllers and services
  -  **Test Cases** for the API endpoint

#### Decisions made during the development
1. ***Nestjs Framework*** 
     - Though the application could have been built with trivial express server but if we think about maintaibility, scalibility, documentation, microservices all these are important factors in a bigger projects. 
     - Hence ***Nestjs*** provides one of the best solution for all the above points. [ Similar work could have been done with Typestack which includes Rounting Controllers, TypeORM, Class Validators, etc... ]
2. ***Microservice Architecture*** 
     - Instead of building a monolith application which can have single point of failure, vertical scaling would be nearly impossible at one point of time and large codebase kind of issues in future.
     - Hence I decided to go with Microservice architecture in which 
       -  ***APP Service Container (AMC)*** only responsible for serving the API
       -  ***REDIS Service Container (RMS)*** only responsible for maintaing the cache
     - With microservice approach we can scale our individual services horizontally, with high fault tolerant and higher availability with Load Balancer, higher throughput. (All can be a extended scope with current architecture)

#### High level design of the application
[![dPAxvs.md.png](https://iili.io/dPAxvs.md.png)](https://freeimage.host/i/dPAxvs)

#### components in the application
1. ***APP Service Container*** (AMC)
   - Responsible for serving all the APIs
   - Sends Event to REDIS Microservice (Fire and Forget Strategy) to cache the content.
   - Sends Message Pattern to REDIS Microservice to fetch the cache content.
   - ***Swagger*** documentation is available with the project
2. ***APP Documentation Container***
   - TSDoc commenting style has been used across the application
   - ***Compodoc*** documentation manager is integrate to generate the documentation. 
3. ***Redis Container***
   - Runs a container containing REDIS on Port 6379
   - APP Microservie Container and REDIS Microservice Container connects with this container
4. ***Redis Microservice Container*** (RMC)
   - Microservice just to communicate with REDIS and perform actions on REDIS container
   - It can handle both Event Pattern and Message Pattern
5. ***Redis Microservice Compodoc Container***
   - TSDoc commenting style has been used across the application
   - ***Compodoc*** documentation manager is integrate to generate the documentation. 
6. ***Frontend Container***
   - It is a multistage build container which first builds the raw application and then only static folder is served by intermediate NGINX container
7. ***Nginx Container***
   - Works as reverse proxy and sits in front of all the containers.
   - Responsible for serving static content as well as for routing API endpoints.

#### Swagger Documentation snapshot
[![dPYKRn.md.png](https://iili.io/dPYKRn.md.png)](https://freeimage.host/i/dPYKRn)

#### Compodoc Documentation snapshot
[![dPYCxf.md.png](https://iili.io/dPYCxf.md.png)](https://freeimage.host/i/dPYCxf)

## How to run this application
  - Option 1 : Github way of cloning repositories 
  - Option 2 : Directly building the application from docker-hub
  - Option 3 : Building the docker images from local code 
## Installation

#### Option 1:  Running project locally
* NPM/Node should be preinstalled in the host machine
* Redis should be installed and running in the host machine
* Please add **github auth token** to make more than the limited github calls 
Follow the below commands to run project locally
```
git clone https://github.com/blocksan/github-search.git

cd github-search

touch .env
    - Add the values for APP_PORT, ROUTE_PREFIX, REDIS_SERVER, GIT_AUTH_TOKEN (optional), SWAGGER_PATH
yarn install

yarn start:dev

yarn run doc 
    -  visit (http://localhost:8080) to view the documentation
    -  visit (http://localhost/api/gitswagger) for swagger documentation
    
cd ..
    - To run REDIS microservice, change to previous directory and follow below commands
git clone https://github.com/blocksan/microservice-redis.git

cd microservice-redis

touch .env
    - Add the value for REDIS_SERVER, REDIS_CLIENT_NAME, REDIS_EXPIRY
    
yarn install

yarn start:dev
```

Test
```bash
# unit tests
$ yarn run test
```

#### Option 2:  Running project via docker images
To run the project using docker please use the ***docker-compose.deploy.yml*** provided with the project
Follow the below steps to run the application
1. Create ***.env*** for frontend container and add values
2. Create ***app.env*** for APP container and add relevant values
3. Create ***microservice.env*** for REDIS Microservice container and add relevant values.
```
docker-compose -f docker-compose.deploy.yml build
docker-compose -f docker-compose.deploy.yml up
```
Open [http://host_ip](http://localhost) to view it in the browser.
Open [http://host_ip:8000](http://localhost:8000) to view APP documentationin the browser
Open [http://host_ip:9000](http://localhost:9000) to view REDIS Microservice documentation in the browser
Open [http://host_ip/api/swagger](http://localhost/api/gitswagger) to view swagger documentation in the browser

#### Option 3:  Running project via docker images
```
git clone https://github.com/blocksan/github-search.git

cd github-search

touch .env
    - Add the values for APP_PORT, ROUTE_PREFIX, REDIS_SERVER, GIT_AUTH_TOKEN (optional), SWAGGER_PATH
    
cd ..
    - To run REDIS microservice, change to previous directory and follow below commands
    
git clone https://github.com/blocksan/microservice-redis.git

cd microservice-redis

touch .env
    - Add the value for REDIS_SERVER, REDIS_CLIENT_NAME, REDIS_EXPIRY
```
#### Production environment
- docker-compose -f docker-compose.yml build
    - This will generate the production docker for the project
- docker-compose -f docker-compose.yml up
    - This will up the application in production environment

#### Development environment (Hot Reloading)
- docker-compose -f docker-compose.dev.yml build
    - This will generate the development docker for the project
- docker-compose -f docker-compose.dev.yml up
    - This will up the application in development environment

#### Stay in touch
 [Sandeep Ghosh](http://sandeepghosh.com)

