---
title: "Licence et mise en place"
linkTitle: "Licence, mise en place"
weight: 2
description: Comment mettre en place l'environnement de développement ? Qu'implique notre licence ?
---

## La licence des contributions de code

Tout le code du dépot OSRD est mis à disposition sous [la licence LGPLv3](https://choosealicense.com/licenses/lgpl-3.0/).
En contribuant du code, vous acceptez la redistribution de votre contribution sous cette license.

La licence LGPL interdit de modifier OSRD sans publier le code source de l'application modifiée : profitez du travail des autres, et laissez les autres profiter de votre travail !

Cette contrainte n'est pas contagieuse à travers les API : Il est possible d'utiliser OSRD comme bibliothèque, framework ou serveur pour s'interfacer avec des composants propriétaires. N'hésitez pas à proposer des changements pour répondre à vos besoins.

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

- Installer `docker` [^package-manager] [^docker-desktop].
- Suivre le [README d'OSRD](https://github.com/osrd-project/osrd#getting-started).

[^package-manager]: Sous Linux, suivez les guides pour votre distribution dans la [documentation de Docker](https://docs.docker.com/engine/install/)
[^git-bash]: Sous Windows, ouvrez `Git Bash`
[^docker-desktop]: Sous Windows/[WSL](https://learn.microsoft.com/fr-fr/windows/wsl/tutorials/wsl-containers), [Docker Desktop](https://www.docker.com/products/docker-desktop/) est recommandé

*[Continuer vers la contribution au code ‣]({{< ref "contribute-code">}})*
