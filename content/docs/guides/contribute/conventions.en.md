---
title: "Style conventions"
linkTitle: "Style conventions"
weight: 90
---

Style conventions are writting rules means to standardize various aspects of the project.

These matter quite a bit: They enable better communication and programming efficiently.

## Commit style

The overall format for git commits is as follows:

```
component: imperative description of the change

Detailed description of the change and what motivates it,
if it is not entirely obvious from the title.
```

- **the commit message, just like the code, must be in english**
- all lowercase
- there can be multiple components separated by `:` in case of hierarchical relationships, with `,` otherwise
- the body of the commit should probably contain a detailed description of the change
