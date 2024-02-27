---
title: "Commit style"
linkTitle: "Commit style"
weight: 4
description: "A few advises and rules about commit messages"
---

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

*[Continue towards sharing your changes ‣]({{< ref "share-changes">}})*
