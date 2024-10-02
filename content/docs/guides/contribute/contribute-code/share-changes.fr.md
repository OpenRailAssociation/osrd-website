---
title: "Partagez vos changements"
linkTitle: "Partagez vos changements"
weight: 5
description: "Comment soumettre votre code pour qu'il soit vérifié ?"
---

L'auteur d'une _pull request (PR)_ est responsable de son « cycle de vie ». Il se charge de contacter les différents acteurs, de suivre la revue de code, répondre aux commentaires et corriger le code suite à la revue de code (vous pouvez également consulter la [page dédiée à la revue de code]({{< ref "/docs/guides/contribute/code-review" >}})).

> En cas de PR conséquente, ne pas hésiter à solliciter plusieurs reviewers qui pourront s'organiser, voire de faire la review ensemble, reviewers et auteur.

1. **Ouvrez une _pull request_** \
   Une fois que vos changements sont prêts, il est temps de proposer de les intégrer à la branche `dev`.
   Cela se fait [dans l'interface web de Github](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

   Si possible :
   - Faites des PRs d'unités logiques et atomiques également (évitez de mélanger le refactoring, les nouvelles fonctionnalités et la correction de bugs en même temps).
   - Ajoutez une description aux PR pour expliquer ce qu'elles font et pourquoi.
   - Aidez le relecteur en suivant les conseils donnés dans [l'article de mtlynch](https://mtlynch.io/code-review-love/).
   - Ajoutez les balises `area:<affected_area>` pour montrer quelle partie de l'application a été impactée. Cela peut être fait via [l'interface web](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

2. **Prenez en compte les retours** \
   Une fois que votre PR est ouverte, [d'autres contributeurs doivent donner leur avis sur votre proposition](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews) :

   - N'importe qui peut donner son avis.
   - Il est nécessaire d'obtenir l'approbation d'un [contributeur familier avec le code](https://github.com/osrd-project/osrd/blob/dev/.github/CODEOWNERS).
   - Il est d'usage de prendre en compte tous les commentaires critiques.
   - Les commentaires sont souvent écrits dans un style plutôt direct, dans le souci de collaborer efficacement vers une solution acceptable par tous.
   - Une fois que tous les commentaires ont été pris en compte, un mainteneur intègre le changement.

> Sur les PR conséquentes et vouées à évoluer dans le temps, conserver les _corrections_ suite à la
relecture dans des _commits séparés_ facilite le travail de relecture. En cas de `rebase` et de
relectures multiples par la même personne ils sont le moyen d'économiser une nouvelle relecture
complète (demandez de l'aide au besoin) :
>  * _Ajoutez des commits de fixup_, amend, squash ou reword à l'aide de la
[documentation dédiée à git commit](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt).
>  * _Fusionnez automatiquement les corrections_ dans les commits originaux de votre PR et vérifier le résultat , à l'aide de
[`git rebase -i --autosquash origin/dev`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---autosquash)
(juste avant le merge et une fois les relectures terminées).
>  * _Poussez vos changements_ avec
[`git push --force-with-lease`](https://git-scm.com/docs/git-push#Documentation/git-push.txt---no-force-with-lease)
car vous ne poussez pas seulement de nouveaux commits, mais bien un changement des commits existants.

3. **N'hésitez pas à relancer vos interlocuteurs, plusieurs fois si besoin est : vous êtes responsable de la vie de votre _pull request_**.

{{% include "../review-process.fr.md" %}}

*[Continuer enfin vers les tests ‣]({{< ref "tests">}})*
