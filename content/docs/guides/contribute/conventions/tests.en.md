---
title: "Tests"
linkTitle: "Tests"
description: "Recommandations for testing purpose"
---

# Integration tests

- Integration tests are written using [pytest](https://docs.pytest.org/) under the `/tests` folder.
- Each route described in the `openapi.yaml` files must have an integration test.
- Test must check both the valid and invalid response format and content.

# Front-end
- End-to-end tests are required for stable and critical features.
  [Playwright](https://playwright.dev/) is used to write these tests.
- To write unit test use [vitest](https://vitest.dev/).
