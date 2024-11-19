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
- `git clone https://github.com/OpenRailAssociation/osrd.git`

### Lancer l'application

Docker est un outil qui réduit considérablement la préparation nécessaire pour travailler sur OSRD:
- télécharger le dernier build de développement : `docker compose pull`
- démarrer OSRD : `docker compose up`
- compiler et démarrer OSRD: `docker compose up --build`
- review une PR avec les images compilées par la CI: `TAG=pr-XXXXX docker compose up --no-build --pull always`


Pour commencer :
- [Installer `docker`]({{< ref "install-docker">}})
- Suivre le [README d'OSRD](https://github.com/OpenRailAssociation/osrd#getting-started).

*[Continuer vers la contribution au code ‣]({{< ref "contribute-code">}})*


[^package-manager]: Sous Linux, utilisez le gestionnaire de packet (comme `apt`)
[^git-bash]: Sous Windows, ouvrez `Git Bash`
