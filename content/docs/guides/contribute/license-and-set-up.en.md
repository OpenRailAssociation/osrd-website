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

Thanks to `docker`, one can easily compile, configure, and run all services after making a change. One can also start only a subset of the services.

- Install `docker`. [^package-manager] [^docker-desktop]
- Follow [OSRD's README](https://github.com/osrd-project/osrd#getting-started).

[^package-manager]: Under Linux, follow installations steps for your distribution on [Docker's documentation](https://docs.docker.com/engine/install/)
[^git-bash]: Under Windows, open `Git Bash`
[^docker-desktop]: Under Windows/[WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers), [Docker Desktop](https://www.docker.com/products/docker-desktop/) is recommended

*[Continue towards code contribution ‣]({{< ref "contribute-code">}})*

#### `editoast` specific: batch dependency updates

We use dependabot on the project to signal when dependencies are outdated. We do not use dependabot to automatically update dependencies, as we want to merge all updates at once and review the changes.

Here is the process to update dependencies:

1. Change the versions.
    * *If you're using VSCode* you can install the [`serayuzgur.crates`](https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates) extension and run the "update all dependencies" command.  
    Make sure that the new version chosen is stable, and that loose constraints are not overwritten in your commit.
    * *If you're not*, you can go check the versions used by dependabot in [its PRs](https://github.com/osrd-project/osrd/pulls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) and update the versions manually.
2. Run `cargo update` to update the Cargo.lock file (even sub-dependencies).
3. Check that all [dependabot editoast PRs](https://github.com/osrd-project/osrd/pulls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) are included in your update.
4. Adapt the code to the new versions, if needed.
5. Create a PR with your changes, and link all dependabot PRs in the description.