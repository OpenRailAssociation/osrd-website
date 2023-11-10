---
title: "Contribuer du code"
linkTitle: "Contribuer du code"
weight: 40
description: "Apporter des modifications au code d'OSRD"
---

{{% alert color="warning" %}}
Tout le code du dépot OSRD est mis à disposition sous [la licence LGPLv3](https://choosealicense.com/licenses/lgpl-3.0/).
En contribuant du code, vous acceptez la redistribution de votre contribution sous cette license.

La licence LGPL interdit de modifier OSRD sans publier le code source de l'application modifiée: profitez du travail des autres, et laissez les autres profiter de votre travail !

Cette contrainte n'est pas contagieuse à travers les API: Il est possible d'utiliser OSRD comme bibliothèque, framework ou serveur pour s'interfacer avec des composants propriétaires. N'hésitez pas à proposer des changements pour répondre à vos besoins.
{{% /alert %}}

## Mise en place

{{% alert color="info" %}}
La plupart des développeurs OSRD utilisent Linux  (y compris [WSL](https://learn.microsoft.com/fr-fr/windows/wsl/)). Vous pouvez utiliser Windows ou MacOS, mais pourriez rencontrer quelques problèmes.
{{% /alert %}}

### Obtenir le code source

- Installer [`git`](https://git-scm.com/)[^package-manager]
- Ouvrir un terminal[^git-bash] dans le dossier qui contiendra le code source d'OSRD
- `git clone git@github.com:osrd-project/osrd`

### Lancer l'application

Grâce à `docker`, on peut facilement compiler, configurer, et lancer les différents composants après un changement. On peut aussi choisir de lancer seulement une partie des composants.

- Installer `docker` [^package-manager][^docker-desktop].
- Suivre le [README d'OSRD](https://github.com/osrd-project/osrd#getting-started).

[^package-manager]: Sous Linux, utilisez le gestionnaire de packet de votre distribution, comme par exemple `apt-get`.
[^git-bash]: Sous Windows, ouvrez `Git Bash`
[^docker-desktop]: Sous Windows/[WSL](https://learn.microsoft.com/fr-fr/windows/wsl/tutorials/wsl-containers), [Docker Desktop](https://www.docker.com/products/docker-desktop/) est recommandé

## Partager vos changements

Ce chapitre décrit le processus aboutissant à l'intégration de code au sein du projet. **Si vous avez besoin d'aide, ouvrez une issue ou envoyez un message instantané.**

1. Si vous n'être pas un habitué de Git, [suivez ce tutoriel](https://learngitbranching.js.org/)

2. **Créez une branche**  
   Si vous comptez contribuer régulièrement, vous pouvez demander accès au [dépot principal](https://github.com/osrd-project/osrd). Sinon, [créez un fork](https://github.com/osrd-project/osrd/fork).

3. **Ajoutez des changements sur votre branche**  
   Essayez de découper votre travail en étapes macroscopiques, et sauvegardez vos changements dans un commit à la fin de chaque étape. Essayez de suivre [les conventions du projet](../conventions/).

4. **Conservez votre branche à jour**

   ```
   git switch <your_branch>
   git fetch
   git rebase origin/dev
   ```

5. **Ouvrez une pull request**  
   Une fois que vos changements sont prêts, il est temps de proposer de les intégrer à la branche `dev`. Cela se fait [dans l'interface web de Github](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
   Si possible, faites des PRs d'unités logiques et atomiques également (évitez de mélanger le refactoring, les nouvelles fonctionnalités et la correction de bugs en même temps).
   Ajoutez une description aux PR pour expliquer ce qu'elles font et pourquoi.
   Aidez le relecteur en suivant les conseils donnés dans [l'article de mtlynch](https://mtlynch.io/code-review-love/).
   Ajouter les balises `area:<affected_area>` pour montrer quelle partie de l'application a été impactée.
   Cela peut être fait via [l'interface web](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

6. **Prennez en compte les retours**  
   Une fois que votre pull request est ouverte, [d'autres contributeurs doivent donner leur avis sur votre proposition](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews):

   - N'importe qui peut donner son avis
   - Il est nécessaire d'obtenir l'approbation d'un [code owner](https://github.com/osrd-project/osrd/blob/dev/.github/CODEOWNERS) pour pouvoir intégrer le changement.
   - Il est d'usage de prendre en compte tous les commentaires critiques
   - Les commentaires sont souvent écrits dans un style plutôt direct, dans le soucis de collaborer efficacement vers une solution acceptable par tous.
   - Une fois que tous les commentaires ont été pris en compte, un mainteneur intègre le changement.

   En tant que reviewer tentez de suivre les recommandations de [mtlynch](https://mtlynch.io/human-code-reviews-1/).

7. **N'hésitez pas à relancer vos interlocuteurs, plusieurs fois si besoin.**

## Style des commits

Le format général des commits est le suivant :

```
composant: description du changement à l'impératif

Description détaillée du contenu et de la motivation du changement,
si le titre n'est pas complètement évident.
```

- **le message comme le code doit être en anglais**
- tout en minuscule
- il peut y avoir plusieurs composants, séparés par des `:` quand il y a une relation hiérarchique, ou des `,` sinon
- dans l'idéal, le corps du commit contient une description du changement.
