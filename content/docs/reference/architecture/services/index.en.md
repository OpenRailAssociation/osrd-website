---
title: "Services"
linkTitle: "Services"
weight: 43
description: OSRD's services architecture
---

It is a multi-service architecture where several software components interact with each other. This choice was made to ensure the modularity of the code and to guarantee the exploitability of certain OSRD services by external applications.

- Valkey is configured as `maxmemory-policy=allkeys-lru` ([documentation](https://valkey.io/topics/lru-cache/))
- Osrdyne has multiple drivers to support:
    - k8s
    - docker
    - process compose
- The gateway supports multiple authentication providers:
    - OpenID Connect (OIDC)
    - Bearer token
    - Mock (for development purpose)
- Some `editoast` endpoints requires an `InfraCache` object which make them stateful. These endpoints are only used in the `editoast-stateful` service. Doing so most endpoints are run by a scalable service.

Coming soon:
- [ ] Adapt `editoast-stateful` so editoast is fully scalable.

![Services architecture](services.en.svg)
