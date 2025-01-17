---
title: "Release process"
linkTitle: "Release process"
weight: 1
description: Here's how OSRD is currently released
---

OSRD has three versions: development (dev), staging, and release.

The development version is the most recent and unstable version of the application, containing the latest features and bug fixes in active development.

Staging versions are created every Thursday at 12pm by tagging the current development state.

If a staging version passes validation testing, it is promoted to become the latest release version. This ensures that only stable, tested code makes it into production releases.

The release process follows this workflow:

1. Ongoing development in the dev branch
2. Weekly staging tags on Thursdays at 12pm
3. Validation testing of staging version
4. Promotion of validated staging builds to release status

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
