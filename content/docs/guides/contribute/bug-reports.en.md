---
title: "Report issues"
linkTitle: "Report issues"
weight: 20
description: "Report a bug or suggest an enhancement"
---

**Please report anything you deem significant!**

Our bug tracking platform is [github](https://github.com/osrd-project/osrd/issues), so you have to register to report bugs.

Follow [this link](https://github.com/osrd-project/osrd/issues/new/choose) and pick whatever template fits the best.

### Bugs

- Bug must have a correct description and the bug's issue template must be filled carefully.
- Bug must be tagged with (_for team members_):
  - `kind:bug`
  - one or several `area:<affected_area>` if possible, if the affected area is not known leave it blank it will be added later by another team member.
  - one `severity:<bug_severity>` if possible, if severity is not known leave it blank it will be added later by another team member.
    - `severity:minor`: User can still use the feature.
    - `severity:major`: User sometimes can't use the feature.
    - `severity:critical`: User can't use the feature.
- OSRD team members can change issues' tags (severity, area, kind, ...).
  You may leave a comment to explain changes.
- If you are working on a bug or plan to work on a bug, assign yourself to the bug.
- PRs solving bugs should add a regression tests to ensure that bug will not be back in the future.
