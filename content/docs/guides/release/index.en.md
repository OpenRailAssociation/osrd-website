---
title: "Release"
linkTitle: "Release"
weight: 10
description: How to make a release
---

All OSRD releases are accessible [here](https://github.com/OpenRailAssociation/osrd/releases)

The process for creating a new release is as follows:

1. We always release on a tested version of the application (staging branch)
    - `git switch staging && git pull`
1. Create a git **annotated** tag
    - We are using the [semantic versioning](https://semver.org/)
    - `git tag -a vx.y.z` (most of the time use the latest version and increment the patch version)
    - `git push --tags vx.y.z`
1. Create a github release
    - Draft a new github release [here](https://github.com/OpenRailAssociation/osrd/releases/new)
    - Select the created tag
    - Generate the releases notes
    - Rename the release like so: "Version x.y.z"
    - Check the "Set as a pre-release" box
    - Apply the [changelog format]({{< relref "#Changelog format" >}})
    - Then you can **publish** the release or **save** the draft if you want to come back later
1. A [github action](https://github.com/OpenRailAssociation/osrd/actions/workflows/release.yml) should be triggered automatically.
1. Post the link of the created release on matrix. Suggest that the developers review the release.

### Changelog format

1. Use the following structure:

```md
## What's Changed

### Features :tada:


### Code refactoring :recycle:


### Bug fixes :bug:


## New Contributors

<!-- Copy from the generated release notes -->
...

<!-- Copy from the generated release notes -->
**Full Changelog**: ...
```

2. Partition the different pull requests
3. Merge or group PR when it make sense. Examples:
    - Bump of dependencies PR (merge)
    - Multi part PR (merge)
    - One big feature implemented by multiple PR (group)
4. Reword PR title. **It should be comprehensible to an external collaborator**
