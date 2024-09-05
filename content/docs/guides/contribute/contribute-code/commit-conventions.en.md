---
title: "Commit conventions"
linkTitle: "Commit conventions"
weight: 4
description: "A few advises and rules about commit messages"
---

## Commit style

The overall format for git commits is as follows:

```
component1, component2: imperative description of the change

Detailed or technical description of the change and what motivates it,
if it is not entirely obvious from the title.
```

- **the commit message, just like the code, must be in english** (only ASCII characters for the title)
- there can be multiple components separated by `:` in case of hierarchical relationships, with `,` otherwise
- components are lower-case, using `-`, `_` or `.` if necessary
- the imperative description of the change begins with a lower-case verb
- the title must not contain any link (`#` is forbidden)

Ideally:

- the title should be self-explanatory: no need to read anything else to understand it
- the commit title is all lower-case
- the title is clear to a reader not familiar with the code
- the body of the commit contains a detailled description of the change

{{% alert title="" color="info"%}}
An automated check is performed to enforce as much as possible this formating.
{{% /alert %}}

### Counter-examples of commit titles

To be avoided entirely:

- `component: update ./some/file.ext`: specify the update itself rather than the file, the files
  are technical elements welcome in the _body_ of the commit
- `component: fix #42`: specify the problem fixed in the title, links (to issue, etc.) are very
  welcome in commit's _body_
- `wip`: describe the work (and finish it)

Welcome to ease review, but do not merge:

- `fixup! previous commit`: an [autosquash](../share-changes) must be run before the merge
- `Revert "previous commit of the same PR"`: both commits must be dropped before merging

## The Developer Certificate of Origin (DCO)

All of OSRD's projects use the DCO (Developer Certificate of Origin) to address
legal matters. The DCO helps confirm that you have the rights to the code you
contribute. For more on the history and purpose of the DCO, you can read [The
Developer Certificate of Origin](https://bssw.io/blog_posts/the-developer-certificate-of-origin)
by Roscoe A. Bartlett.

To comply with the DCO, **all commits must include a Signed-off-by line**.

### How to sign a commit using git in a shell ?

To sign off a commit, simply add the `-s` flags to your `git commit` command,
like so:

```bash
git commit -s -m "Your commit message"
```
This also applies when using the `git revert` command.

### How to do sign a commit using git in Visual Studio Code (VS Code) ?

Now, go in `Files` -> `Preferences` -> `Settings`, search for and activate
the **Always Sign Off** setting.

Finally, when you'll commit your changes via the VS Code interface, your commits
will automaticaly be signed-off.

*[Continue towards sharing your changes ‣]({{< ref "share-changes">}})*
