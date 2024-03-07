---
title: "Services"
linkTitle: "Services"
weight: 43
description: OSRD's services architecture
---

It is a multi-service architecture where several software components interact with each other. This choice was made to ensure the modularity of the code and to guarantee the exploitability of certain OSRD services by external applications.

## Current 

![Services architecture](services.en.svg)

## Target 

Mutiple things are planned to be done in the future, including:

- [X] Add an authenticating reverse proxy service (gateway) 
- [X] Deploy `editoast` as a scalable map tile service 
- [ ] Make the `core` service scalable
  - Core services will handle only one infrastructure (on a given version) at a time
  - Add a message broker (RabbitMQ) to dispatch queries to the right instance
  - Create a `core-controller` service that will spawn / kill / scale `core` services (k8s and docker support)
  - Responsibility for infrastructures loading is moved from the front to the `core-controller`

![Services architecture](services_target.en.svg)
