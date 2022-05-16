---
title: "Commit style"
linkTitle: "Commit style"
weight: 10
---

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
