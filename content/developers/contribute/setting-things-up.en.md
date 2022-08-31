---
title: "Setting things up"
linkTitle: "Setting things up"
weight: 15
description: Learn to set up a development environment
---

{{% alert color="info" %}}
Most OSRD developers use Linux. Windows and MacOS should work too, but you may run into some issues.
{{% /alert %}}

## Getting the source code

- Install [`git`](https://git-scm.com/).[^package-manager]
- Open a terminal[^git-bash] in the folder where the source code of OSRD will be located
- Run `git clone git@github.com:DGEXSolutions/osrd`

## Launch the application with docker-compose

For a long time, making changes to a component of a multi-service application involved compiling, configuring and running all services manually.

Nowadays, it can be done using `docker-compose`. You can even start only a subset of the services.

- Install `docker` and `docker-compose`. [^package-manager]
- Run `docker-compose up --build`

[^package-manager]: Under Linux, use your distribution's package manager, such as `apt-get`
[^git-bash]: Under Windows, open `Git Bash`
