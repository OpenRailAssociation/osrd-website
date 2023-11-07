---
title: "Tests"
linkTitle: "Tests"
weight: 6
description: "Recommandations for testing purpose"
---

## Back-end
- Integration tests are written with [pytest](https://docs.pytest.org/) in the `/tests` folder.
- Each route described in the `openapi.yaml` files must have an integration test.
- The test must check both the format and content of valid and invalid responses.

## Front-end
The functional writing of the tests is carried out with the *Product Owners*, and the developers choose a technical implementation that precisely meets the needs expressed and fits in with the recommendations presented here.

We use [Playwright](https://playwright.dev/) to write end-to-end tests, and [vitest](https://vitest.dev/) to write unit tests.

The browsers tested are currently [Firefox](https://www.mozilla.org/fr/firefox/switch/) and Chromium.

### Basic principles
- Tests must be **short** (1min max) and go **straight to the point**.
- Arbitrary timeouts are outlawed; a test must systematically wait for a specific event. It is possible to use *polling* (retry an action - a click for example - after a certain time) proposed in the [Playwright's](https://playwright.dev/) API.
- All tests must be parallelizable.
- Tests must not point to or wait for text elements from the translation, prefer the *DOM* tree structure or place specific `id`.
- We're not testing the data, but the application and its functionality. Data-specific tests should be developed in parallel.

#### Data
**The data tested must be public data**.
The data required (infrastructure and rolling stock) for the tests are offered in the application's `json` files, *injected* at the start of each test and deleted at the end, regardless of its result or how it is stopped, including with `CTRL+C`.

This is done by API calls in typescript before launching the actual test.

The data tested is the same, both locally and via continuous integration.

#### Atomicity of a test
Each test must be **atomic**: it is self-sufficient and cannot be divided.

A test will target a single feature or component, provided it is not too large. A test will not test an entire module or application; it will necessarily be a set of tests, in order to preserve test atomicity.

If a test needs elements to be created or added, these operations must be carried out by API calls in typescript upstream of the test, as is done for adding data. These elements must be deleted at the end of the test, regardless of the result or how it is stopped, including by `CTRL+C`.

This allows tests to be parallelized.

However, in certain cases where it is relevant, a test may contain several clearly explained and justified test subdivisions (several `test()` in a single `describe()`).

### Example of a test
The requirement: "We want to test the addition of a train to a timetable".

1. add the test infrastructure and rolling stock to the database **by API calls**.
2. create project, study and scenario with choice of test infrastructure **by API calls**.
3. start the test, clicking on "add one or more trains" until the presence of the trains in the timetable is verified
4. the test passes, fails or is stopped, the project, study and scenario are deleted, along with the test rolling stock and infrastructure **by API calls**.

*NB: the test will not test all the possibilities offered by the addition of trains; this should be a specific test which would test the response of the interface for all scenarios without adding trains.*

*[Continue towards write code ‣]({{< ref "write-code">}})*
