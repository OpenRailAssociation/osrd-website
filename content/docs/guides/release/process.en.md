---
title: "Release process"
linkTitle: "Release process"
weight: 1
description: Here's how OSRD is currently released
---

OSRD has three versions: development (dev), staging, and release.

The development version is the most recent and unstable version of the application, containing the latest features and bug fixes in active development.

## Usual process

Staging versions are created every Thursday at 12pm by tagging the current development state.

If a staging version passes validation testing, it is promoted to become the latest release version. This ensures that only stable, tested code makes it into production releases.

The release process follows this workflow:

1. Ongoing development in the `dev` branch
2. Weekly `staging` tags on Thursdays at 12pm
3. Validation testing of `staging` version
4. Promotion of validated `staging` builds to release status

```ascii
    Development         Staging                   Release
    (unstable)         (testing)                 (stable)

    [Dev Branch]                                    |
         |                                          |
         |--->     Thursday 12pm                    |
         |         [Staging Tag]                    |
         |                |                         |
         |            Validation                    |
         |             Testing                      |
         |                |                         |
         |                o---> If Passes -->  [New Release]
         |                       Tests              |
    [Continue Dev]                                  |
         |                                          |
         V                                          V
```

## Stabilization and innovation iteration

Every 11 weeks, an iteration (2 weeks) is dedicated to stabilization and innovation.

The goal is to ensure that a stable version is released by this term (focus on bug detection and correction).
A staging version is created on the last Friday evening before this iteration of stabilization and
innovation (deadline for adding features or refactors).

The work process during this period is as follows:

* The `dev` branch follows its usual process (to avoid blocking work or creating additional conflicts).
* A special focus is put on bugfix, through the following process:
  1. A fix PR is opened and merged on the `dev` branch.
  2. Then a new PR is opened to backport the fix to the `staging` branch.

A bug issue therefore requires 2 PRs to be closed.
This process is maintained for 2 weeks (even if the validation tests are correct by the first week).
