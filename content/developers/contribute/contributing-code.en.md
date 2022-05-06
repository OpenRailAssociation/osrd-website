---
title: "Contribute code"
linkTitle: "Contribute code"
weight: 40
description: "Integrate changes into OSRD"
---

This chapter is about the process of integrating changes into the common code base. **If you need help at any stage, open an issue or message us.**

1) If you are not used to Git, [follow this tutorial](https://learngitbranching.js.org/)

2) **Create a branch**  
If you intend to contribute regularly, you can request access to the [main repository](https://github.com/DGEXSolutions/osrd). Otherwise, [create a fork](https://github.com/DGEXSolutions/osrd/fork).

3) **Add changes to your branch**  
Before you start working, try to split your work into macroscopic steps. At the end of each stop, save your changes into a commit. Try to follow [style conventions](../conventions/).

4) **Open a pull request**  
Once your changes are ready, you have to request integration with the `dev` branch. It can be done through [the web interface](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

5) **Take feedback into account**  
Once your pull request is open, [other contributors can review your changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews):
   - Any user can review your changes
   - Your code has to be approved by a contributor [familiar with the code](https://github.com/DGEXSolutions/osrd/blob/dev/.github/CODEOWNERS)
   - All users are expected to take critical comments into account
   - Comments tend to be written in an open and direct manner. The intent is to efficiently collaborate towards a solution we all agree on.
   - Once all discussions are resolved, a maintainer integrates the change.

6) **If you believe somebody forgot to review / merge your change, please speak out, multiple times if needs be.**
