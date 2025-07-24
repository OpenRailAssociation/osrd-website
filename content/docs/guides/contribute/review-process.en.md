## Review cycle

A code review is an iterative process.
For a smooth review, it is imperative to [correctly configure your github notifications](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications).

It is advisable to configure OSRD repositories as *"Participating and @mentions"*. This allows you to be notified of activities only on issues and PRs in which you participate.

> Maintainers are automatically notified by the `CODEOWNERS` system. The author of a PR is responsible for advancing their PR through the review process and manually requesting maintainer feedback if necessary.

```mermaid
sequenceDiagram
  actor A as PR author
  actor R as Reviewer/Maintainer

  A->>R: Asks for a review, notifying some people
  R->>A: Answers yes or no

  loop Loop between author and reviewer
    R-->>A: Comments, asks for changes
    A-->>R: Answers to comments or requested changes
    A-->>R: Makes necessary changes in dedicated "fixups"
    R-->>A: Reviews, tests changes, and comments again
    R-->>A: Resolves requested changes/conversations if ok
  end

  A->>R: Rebase and apply fixups
  R->>A: Checks commits history
  R->>A: Approves the PR
  Note right of A: Add to the merge queue
```
