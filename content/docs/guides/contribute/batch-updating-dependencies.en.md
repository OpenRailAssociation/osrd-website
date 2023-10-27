---
title: "Batch dependency updates"
linkTitle: "Batch dependency updates"
weight: 20
description: ""
---


## For editoast

We use dependabot on the project to signal when dependencies are outdated. We do not use dependabot to automatically update dependencies, as we want to merge all updates at once and review the changes.

Here is the process to update dependencies:

1. Change the versions.
    * *If you're using VSCode* you can install the `crates` extension and run the "update all dependencies" command.  
    Doing so will update all dependencies to their latest version, and overwrite voluntarily loose version constraints.  
    Make sure that the new version chosen is stable, and that loose constraints are not overwritten in your commit.
    * *If you're not*, you can go check the versions used by dependabot in [its PRs](https://github.com/osrd-project/osrd/lls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) and update the versions manually.
2. Run `cargo update` to update the Cargo.lock file (even sub-dependencies).
3. Check that all [dependabot editoast PRs](https://github.com/osrd-project/osrd/lls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) are included in your update.
4. Adapt the code to the new versions, if needed.
5. Create a PR with your changes, and link all dependabot PRs in the description.