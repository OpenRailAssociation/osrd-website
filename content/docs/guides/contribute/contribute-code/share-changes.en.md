---
title: "Share your changes"
linkTitle: "Share your changes"
weight: 5
description: "How to submit your code modifications for review?"
---

The author of a _pull request (PR)_ is responsible for its "life cycle". He is responsible for contacting the various parties involved, following the review, responding to comments and correcting the code following review (you could also check [dedicated page about code review]({{< ref "/docs/guides/contribute/code-review" >}})).

> In the case of a large PR, don't hesitate to ask several reviewers to organize themselves, or even to carry out the review together, reviewers and author.

1. **Open a _pull request_** \
   Once your changes are ready, you have to request integration with the `dev` branch.

   If possible:
      - Make PR of logical and atomic units too (avoid mixing refactoring, new features and bug fix at the same time).
      - Add a description to PRs to explain what they do and why.
      - Help the reviewer by following advice given in [mtlynch article](https://mtlynch.io/code-review-love/).
      - Add tags `area:<affected_area>` to show which part of the application have been impacted. It can be done through [the web interface](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

2. **Take feedback into account** \
   Once your PR is open, [other contributors can review your changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews):

   - Any user can review your changes.
   - Your code has to be approved by [a contributor familiar with the code](https://github.com/osrd-project/osrd/blob/dev/.github/CODEOWNERS).
   - All users are expected to take comments into account.
   - Comments tend to be written in an open and direct manner.
     The intent is to efficiently collaborate towards a solution we all agree on.
   - Once all discussions are resolved, a maintainer integrates the change.

> For large PRs that are bound to evolve over time, keeping _corrections_ during review in separate
_commits_ helps reviewers. In the case of multiple reviews by the same person, this can save full
re-review (ask for help if necessary):
>  * _Add fixup_, amend, squash or reword commits using the
[git commit documentation](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt).
>  * _Automatically merge corrections_ into the original commits of your PR and check the result, using
[`git rebase -i --autosquash origin/dev`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---autosquash)
(just before the merge and once review process is complete).
>  * _Push your changes_ with
[`git push --force-with-lease`](https://git-scm.com/docs/git-push#Documentation/git-push.txt---no-force-with-lease)
because you are not just pushing new commits, you are pushing changes to existing commits.

3. **If you believe somebody forgot to review / merge your change, please speak out, multiple times if needs be.**

{{% include "../review-process.en.md" %}}

*[Finally continue towards tests ‣]({{< ref "tests">}})*
