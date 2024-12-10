---
title: "Review process"
linkTitle: "Review process"
description: "How to give useful feedback"
weight: 4
---

The reviewer/maintainer undertakes to carry out the review quickly, and is also responsible for closing _request changes_, check commit history and quickly merge the _pull request_ if allowed.

We propose you a few tips and recommendations that we think are relevant to a human, relevant and rewarding code review for all contributors:
- [How to Make Your Code Reviewer Fall in Love with You?](https://mtlynch.io/code-review-love/) by Michael Lynch.
- [How to Do Code Reviews Like a Human? ](https://mtlynch.io/human-code-reviews-1/) by Michael Lynch.

{{% include "./review-process.en.md" %}}

## The code review pyramid

{{< figure src="/images/docs/contribute/code_review_pyramid.svg" link="https://www.morling.dev/blog/the-code-review-pyramid/">}}

## Script for testing a PR

When reviewing a PR, it is useful to test the changes by starting an instance of the OSRD app based on the PR branch.

A script is available to spin up a separate and dedicated app instance using the PR number. The script uses the Docker images already built by the CI and launches the app, running in isolation. This allows you to run both instances simultaneously without conflicts (ideal for comparing changes, for example).

Additionally, you can specify a database backup, which the script will load directly into the app.

The app will be launched on the 4001 port. You can access it at: http://localhost:4001/

### Available Commands:

* `./scripts/pr-tests-compose.sh 8914 up`: Downloads the CI-generated images for PR #8914 and launches the application.
* `./scripts/pr-tests-compose.sh 8914 up-and-load-backup ./path_to_backup`: Downloads the images for PR #8914, restores data from the provided backup, and starts the application.
* `./scripts/pr-tests-compose.sh down`: Shuts down the test application instance for PR #8914.
* `./scripts/pr-tests-compose.sh down-and-clean`: Shuts down the test instance and cleans all the instance's docker volumes (PG data, Valkey cache, RabbitMQ) to prevent any side-effects.

### Accessing Services:

Apart from the `frontend` server, all localhost services are available on localhost, with a minor port adjustment (to avoid conflicts with the dev environment): for a list of common ports, have a look at the [dedicated docker-compose file](https://github.com/OpenRailAssociation/osrd/blob/dev/docker/docker-compose.pr-test.yml).
