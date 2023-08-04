---
title: "Style guide"
linkTitle: "Style guide"
weight: 40
description: "Coding style guide and best practices"
---

OSRD application is split in multiple services written in several languages. We try to follow general code best practices and follow specificity for each languages when required.

## General rules

- Explain what you're doing and why.
- Document new code with doc comments.
- Include clear, simple tests.
- Break work into digestible chunks.
- Take the time to pick good names.
  Avoid non well-known abbreviations.
- **Control and consistency over 3rd party code reuse**: Only add a dependency if it is absolutely necessary.
  Every dependency we add decreases our autonomy and consistency.
- **Don't re-invent every wheel**: As a counter to the previous point, don't re-invent everything at all costs.
  If there is a dependency in the ecosystem that is the "de-facto" standard, we should heavily consider using it.
- More code general recommendations in main repository [CONTRIBUTING.md](https://github.com/osrd-project/osrd).
- Ask for any help that you need!
