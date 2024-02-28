---
title: "General principles"
linkTitle: "General principles"
weight: 1
description: "Please read this first!"
---

- Explain what you're doing and why.
- Document new code with doc comments.
- Include clear, simple tests.
- Break work into digestible chunks.
- Take the time to pick good names.
- Avoid non well-known abbreviations.
- **Control and consistency over 3rd party code reuse**: Only add a dependency if it is absolutely necessary.
- Every dependency we add decreases our autonomy and consistency.
- We try to keep PRs bumping dependencies to a low number each week in each component, so grouping
dependency bumps in a batch PR is a valid option (see component's `README.md`).
- **Don't reinvent every wheel**: as a counter to the previous point, don't reinvent everything at all costs.
- If there is a dependency in the ecosystem that is the "de facto" standard, we should heavily consider using it.
- More code general recommendations in main repository [CONTRIBUTING.md](https://github.com/osrd-project/osrd/blob/dev/CONTRIBUTING.md).
- Ask for any help that you need!

*[Consult back-end conventions ‣]({{< ref "backend-conventions">}})*

*[Consult front-end conventions ‣]({{< ref "frontend-conventions">}})*

*[Continue towards write code ‣]({{< ref "write-code">}})*

*[Continue towards tests ‣]({{< ref "tests">}})*
