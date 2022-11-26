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


Ce chapitre décrit le processus aboutissant à l'intégration de code au sein du projet. **Si vous avez besoin d'aide, ouvrez une issue ou envoyez un message instantané.**

1) Si vous n'être pas un habitué de Git, [suivez ce tutoriel](https://learngitbranching.js.org/)

2) **Créez une branche**  
Si vous comptez contribuer régulièrement, vous pouvez demander accès au [dépot principal](https://github.com/DGEXSolutions/osrd). Sinon, [créez un fork](https://github.com/DGEXSolutions/osrd/fork).

3) **Ajoutez des changements sur votre branche**  
Essayez de découper votre travail en étapes macroscopiques, et sauvegardez vos changements dans un commit à la fin de chaque étape. Essayez de suivre [les conventions du projet](../conventions/).

4) **Ouvrez une pull request**  
Une fois que vos changements sont prêts, il est temps de proposer de les intégrer à la branche `dev`. Cela se fait [dans l'interface web de Github](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

5) **Prennez en compte les retours**  
Une fois que votre pull request est ouverte, [d'autres contributeurs doivent donner leur avis sur votre proposition](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews):
   - N'importe qui peut donner son avis
   - Il est nécessaire d'obtenir l'approbation de [quelqu'un familier avec le code](https://github.com/DGEXSolutions/osrd/blob/dev/.github/CODEOWNERS) pour pouvoir intégrer le changement
   - Il est d'usage de prendre en compte tous les commentaires critiques
   - Les commentaires sont souvent écrits dans un style plutôt direct, dans le soucis de collaborer efficacement vers une solution acceptable par tous.
   - Une fois que tous les commentaires ont été pris en compte, un mainteneur intègre le changement.

6) **N'hésitez pas à relancer vos interlocuteurs, plusieurs fois si besoin.**
