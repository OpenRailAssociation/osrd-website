---
title: "License and set-up"
linkTitle: "License and set-up"
weight: 2
description: How to set up your development environment? What does our license involve?
---

## License of code contributions

The source code of OSRD is available under [the LGPLv3 license](https://choosealicense.com/licenses/lgpl-3.0/).
By contributing to the codebase, you consent to the distribution of your changes under the project's license.

LGPLv3 forbids modifying source code without sharing the changes under the same license: use other people's work, and share yours!

This constraint does not propagate through APIs: You can use OSRD as a library, framework or API server to interface with proprietary software. Please suggest changes if you need new interfaces.

## Set things up

{{% alert color="info" %}}
Most OSRD developers use Linux (incl. [WSL](https://learn.microsoft.com/en-us/windows/wsl/)). Windows and MacOS should work too, but you may run into some issues.
{{% /alert %}}

### Get the source code

- Install [`git`](https://git-scm.com/).[^package-manager]
- Open a terminal[^git-bash] in the folder where the source code of OSRD will be located
- Run `git clone git@github.com:osrd-project/osrd`

### Launch the application

Docker is a tool which greatly reduces the amount of setup required to work on OSRD:
- download the latest development build: `docker compose pull`
- start OSRD: `docker compose up`
- build and start OSRD: `docker compose up --build`
- review a PR using CI built images: `TAG=pr-XXXXX docker compose up --no-build --pull always`

To get started:
- [Install `docker`]({{< ref "install-docker">}})
- Follow [OSRD's README](https://github.com/osrd-project/osrd#getting-started).

*[Continue towards code contribution ‣]({{< ref "contribute-code">}})*


[^package-manager]: Under Linux, use the package manager (such as `apt`)
[^git-bash]: Under Windows, open `Git Bash`
