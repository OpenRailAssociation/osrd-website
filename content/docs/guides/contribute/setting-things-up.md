---
title: "Mise en place"
linkTitle: "Mise en place"
weight: 15
description: Apprendre à mettre en place un environnement de développement
---

{{% alert color="info" %}}
La plupart des développeurs OSRD utilisent Linux. Vous pouvez utiliser Windows ou MacOS, mais pourriez rencontrer quelques problèmes.
{{% /alert %}}

## Obtenir le code source

- Installer [`git`](https://git-scm.com/)[^package-manager]
- Ouvrir un terminal[^git-bash] dans le dossier qui contiendra le code source d'OSRD
- `git clone git@github.com:DGEXSolutions/osrd`

## Lancer l'application avec docker-compose

Pendant longtemps, même dans les cas où on ne développe que sur une partie des composants de l'application à la fois, il était necessaire de compiler, configurer et lancer les différents composants de l'application.

L'outil `docker-compose`, sert à lancer les composants d'OSRD.

- Installer `docker` et `docker-compose`[^package-manager]
- Lancer `docker-compose up --build`

[^package-manager]: Sous Linux, utilisez le gestionnaire de packet de votre distribution, comme par exemple `apt-get`.
[^git-bash]: Sous Windows, ouvrez `Git Bash`
