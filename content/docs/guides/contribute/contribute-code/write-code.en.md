---
title: "Write code"
linkTitle: "Write code"
weight: 3
description: "Integrate changes into OSRD"
---

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
*[Continue towards commit style ‣]({{< ref "commit-style">}})*
