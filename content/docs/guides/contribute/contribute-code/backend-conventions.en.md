---
title: "Back-end conventions"
linkTitle: "Back-end conventions"
weight: 2
description: "Coding style guide and best practices for back-end"
---

# Python

Python code is used for some packages and integration testing.

- Follow the [Zen of Python](https://www.python.org/dev/peps/pep-0020/).
- Projects are organized with [uv](https://docs.astral.sh/uv/)
- Code is linted with [ruff](https://docs.astral.sh/ruff/).
- Code is formatted with [ruff](https://docs.astral.sh/ruff/).
- Python tests are written using [pytest](https://docs.pytest.org/).
- Typing is checked using [pyright](https://microsoft.github.io/pyright/).

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

# OpenAPI and generated frontend code

The editoast interface is specified using [OpenAPI](https://spec.openapis.org/oas/v3.1.2.html), in order to generate relevant types for the frontend.

editoast's OpenAPI description and the generated frontend code are tracked in OSRD's git repository and the CI ensures they are up to date.

If you change editoast's API, you will need to update them using `./scripts/sync-openapi.sh`.

# Java

- Code is formatted with [checkstyle](https://checkstyle.sourceforge.io/).
