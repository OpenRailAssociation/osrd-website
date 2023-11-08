---
title: "Back-end"
linkTitle: "Back-end"
description: "Coding style guide and best practices for back-end"
---

# Python

Python code is used for some packages and integration testing.

- Follow [the Zen of Python](https://www.python.org/dev/peps/pep-0020/).
- Code is linted with [flake8](https://github.com/csachs/pyproject-flake8).
- Code is formatted with [Black](https://github.com/psf/black).
- Imports are sorted with [Isort](https://github.com/PyCQA/isort).
- Python tests are written using [pytest](https://docs.pytest.org/).
- Typing is checked using [pytype](https://google.github.io/pytype/).

# Rust

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

# Java

- Code is formatted with [checkstyle](https://checkstyle.sourceforge.io/).
