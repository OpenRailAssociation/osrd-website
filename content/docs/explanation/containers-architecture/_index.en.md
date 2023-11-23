---
title: "Containers architecture"
linkTitle: "Containers architecture"
weight: 10
description: "How the containers works together and how they are built"
---

There are 3 main containers deployed in a standard OSRD setup:
 - **Gateway** _(includes the frontend)_: Serves the front end, handles authentication and proxies requests to the backend.
 - **Editoast**: Acts as the backend that interacts with the front end.
 - **Core**: Handles computation and business logic, called by Editoast.

## Standard deployment

The standard deployment can be represented with the following diagram.

```mermaid
flowchart TD
    gw["gateway"]
    front["front-end static files"]
    gw -- local file --> front
    
    browser --> gw
    gw -- HTTP --> editoast
    editoast -- HTTP --> core
```

External requests are received by the gateway. If the path asked starts with `/api` it will be forwarded using HTTP to editoast, otherwise it will serve a file with the asked path. Editoast reach the core using HTTP if required.

The gateway is not only a reverse proxy with the front-end bundle included, it also provides all the authentication mechanisms: using OIDC or tokens.