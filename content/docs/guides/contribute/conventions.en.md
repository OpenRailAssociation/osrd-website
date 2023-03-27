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
- More code general recommendations in main repository [CONTRIBUTING.md](https://github.com/DGEXSolutions/osrd).
- Ask for any help that you need!

### Python

Python code is used for some packages and integration testing.

- Follow [the Zen of Python](https://www.python.org/dev/peps/pep-0020/).
- Code is linted with [flake8](https://github.com/csachs/pyproject-flake8).
- Code is formatted with [Black](https://github.com/psf/black).
- Imports are sorted with [Isort](https://github.com/PyCQA/isort).
- Python tests are written using [pytest](https://docs.pytest.org/).

### Rust

- As a reference for our API development we are using the [Rust API guidelines](https://rust-lang.github.io/api-guidelines/about.html).
  Generally, these should be followed.
- Prefer granular imports over glob imports like `diesel::*`.
- Tests are written with the [built-in testing framework](https://doc.rust-lang.org/book/ch11-01-writing-tests.html).
- Use the [documentation example](https://doc.rust-lang.org/rust-by-example/meta/doc.html) to know how to phrase and format your documentation.
- Use consistent comment style:
  - `///` doc comments belong above `#[derive(Trait)]` invocations.
  - `//` comments should generally go above the line in question, rather than in-line.
  - Start comments with capital letters. End them with a period if they are sentence-like.
- Use comments to organize long and complex stretches of code that can't sensibly be refactored into separate functions.
- Code is linted with [clippy](https://github.com/rust-lang/rust-clippy).
- Code is formatted with [fmt](https://github.com/rust-lang/rustfmt).

### Java

- Code is formatted with [checkstyle](https://checkstyle.sourceforge.io/).

### Javascript / Typescript / Front

- When adding new files, write them in TypeScript as there is a goal to move to TypeScript.
- Use generated endpoints from the `openapi.yaml` files to consume the backend.
- Code is linted with [eslint](https://eslint.org/).
- Code is formatted with [prettier](https://prettier.io/).
- End-to-end tests are required for stable and critical features.
  [Playwright](https://playwright.dev/) is used to write these tests.
- To write unit test use [vitest](https://vitest.dev/).

### Integration tests

- Integration tests are written using [pytest](https://docs.pytest.org/) under the `/tests` folder.
- Each route described in the `openapi.yaml` files must have an integration test.
- Test must check both the valid and invalid response format and content.
