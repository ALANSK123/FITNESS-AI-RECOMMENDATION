# Backend

This folder contains the backend services for the microservice-based project.

## Overview
The backend is built using a microservice architecture.  
Each service is responsible for a specific business function and communicates independently.

## Features
- microservice-based structure
- REST APIs
- separation of responsibilities
- scalable backend design
- independent services for different modules

## Tech Stack
- Java
- Spring Boot
- Maven  
- PostgreSQL, Eureka, Gateway, Config Server, Docker.

## Project Structure
This backend may include services such as:
- API Gateway
- Service Registry
- Config Server
- Authentication Service
- User Service
- Product Service


## Folder Purpose
This folder contains:
- all backend microservices
- service configuration files
- API logic
- controllers, services, repositories
- inter-service communication setup

## How to Run
1. Open the backend folder in your IDE
2. Start required infrastructure services first
3. Run each microservice one by one

Typical order:
1. Config Server
2. Service Registry
3. API Gateway
4. Other microservices

## Build and Run
For Maven projects:

```bash
mvn clean install
mvn spring-boot:run
