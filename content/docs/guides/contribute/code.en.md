---
title: "Contribute code"
linkTitle: "Contribute code"
weight: 40
description: "Integrate changes into OSRD"
---

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

- Install `docker`. [^package-manager][^docker-desktop]
- Follow [OSRD's README](https://github.com/osrd-project/osrd#getting-started).

[^package-manager]: Under Linux, use your distribution's package manager, such as `apt-get`
[^git-bash]: Under Windows, open `Git Bash`
[^docker-desktop]: Under Windows/[WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers), [Docker Desktop](https://www.docker.com/products/docker-desktop/) is recommended

## Share your changes

{{% alert color="warning" %}}
The source code of OSRD is available under [the LGPLv3 license](https://choosealicense.com/licenses/lgpl-3.0/).
By contributing to the codebase, you consent to the distribution of your changes under the project's license.

LGPLv3 forbids modifying source code without sharing the changes under the same license: use other people's work, and share yours!

This constraint does not propagate through APIs: You can use OSRD as a library, framework or API server to interface with proprietary software. Please suggest changes if you need new interfaces.
{{% /alert %}}

This chapter is about the process of integrating changes into the common code base. **If you need help at any stage, open an issue or message us.**

1. If you are not used to Git, [follow this tutorial](https://learngitbranching.js.org/)

2. **Create a branch**  
   If you intend to contribute regularly, you can request access to the [main repository](https://github.com/osrd-project/osrd). Otherwise, [create a fork](https://github.com/osrd-project/osrd/fork).

3. **Add changes to your branch**  
   Before you start working, try to split your work into macroscopic steps.
   At the end of each stop, save your changes into a commit.
   Try to make commits of logical and atomic units.
   Try to follow [style conventions](../conventions/).

4. **Keep your branch up-to-date**

   ```
   git switch <your_branch>
   git fetch
   git rebase origin/dev
   ```

5. **Open a pull request**  
   Once your changes are ready, you have to request integration with the `dev` branch.
   If possible, make PR of logical and atomic units too (avoid mixing refactoring, new features and bug fix at the same time).
   Add a description to PRs to explain what they do and why.
   Help the reviewer by following advice given in [mtlynch article](https://mtlynch.io/code-review-love/).
   Add tags `Area:<affected_area>` to show which part of the application have been impacted.
   It can be done through [the web interface](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

6. **Take feedback into account**  
   Once your pull request is open, [other contributors can review your changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews):

   - Any user can review your changes
   - Your code has to be approved by a contributor [familiar with the code](https://github.com/osrd-project/osrd/blob/dev/.github/CODEOWNERS)
   - All users are expected to take comments into account.
   - Comments tend to be written in an open and direct manner.
     The intent is to efficiently collaborate towards a solution we all agree on.
   - Once all discussions are resolved, a maintainer integrates the change.

   As a reviewer try to follow advice given in [mtlynch article](https://mtlynch.io/human-code-reviews-1/).

7. **If you believe somebody forgot to review / merge your change, please speak out, multiple times if needs be.**

## Git commit style

The overall format for git commits is as follows:

```
component1, component2: imperative description of the change

Detailed or technical description of the change and what motivates it,
if it is not entirely obvious from the title.
```

- **the commit message, just like the code, must be in english**
- there can be multiple components separated by `:` in case of hierarchical relationships, with `,` otherwise
- components are lower-case, using `-`, `_` or `.` if necessary
- the imperative description of the change begins with a lower-case verb

Ideally:

- the title should be self-explanatory: no need to read anything else to understand it
- the commit title is all lower-case
- the title is clear to a reader not familiar with the code
- the body of the commit contains a detailled description of the change

### Commit counter-examples

- `component: update ./lol/mdr.rs`: specify the update itself rather than the file.
- `component: fix #42`: specify the problem fixed
- `wip`: describe the work (and finish it)
