---
title: "Deploy OSRD"
linkTitle: "Deploy OSRD"
weight: 10
description: Learn how to deploy OSRD in various environments
---

First of all, we recommend learning about the [containers architecture of OSRD]({{< ref "/docs/explanation/containers-architecture" >}}).

We will cover how to deploy OSRD within the following setups:

 - [Using docker compose]({{< ref "/docs/guides/deploy/docker-compose" >}}) on a single node.
 - [Using helm]({{< ref "/docs/guides/deploy/docker-compose" >}}) on a kubernetes cluster.

It is also possible to deploy each service of OSRD manually on a system, but we will not cover this topic within this guide.


{{% alert title="NB" color="warning" %}}
In order for the STDCM tool to function, you'll need to setup the STDCM Search Environment, a configuration stored in database.
See the [dedicated page]({{< ref "/docs/guides/deploy/stdcm-search-env" >}}) for more information.
{{% /alert %}}
