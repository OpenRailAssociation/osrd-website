---
title: Open Source
linkTitle: Open Source
description: OSRD et l'Open Source
weight: 200
---

L’open source est une **pratique de développement logiciel**, où le code source[^code-source] du logiciel est :
 - généralement développé de manière ouverte et collaborative, par des acteurs variés
 - accessible et gratuitement utilisable par tous
 - tout le monde est libre de proposer un changement, ou créer un logiciel dérivé
 - redistribuable par tous

En pratique, l'open source est à la fois un **cadre légal** pour le travail collaboratif, et un **ensemble de pratiques**.

[^code-source]: Le code source est un ensemble de documents texte qui définit comment fonctionne une application. C'est le produit du travail de développeurs logiciels.

## Application à OSRD

Dans le contexte d'OSRD, ce modèle a de **multiples avantages** :
 - les algorithmes et le savoir-faire développé est ouvert à tous
 - les coûts de développement et résultats sont mutualisés entre les différents acteurs
 - permet de faciliter l'interopérabilité entre systèmes d'information en facilitant la standardisation et l'uniformisation
 - permet de catalyser la collaboration d'acteurs aux objectifs communs
 - permet à chaque acteur d'adapter librement le logiciel à ses besoins
 - il permet aux organismes de recherche publics de contribuer directement, et de profiter du projet
 - il permet aux acteurs publics de répondre à leurs impératifs de transparence

L'utilisation d'un projet open source comme catalyseur de collaboration industrielle a de nombreux antécédents :
 - **Blender** est un outil de modélisation, rendu, et animation 3D très complet, qui est récemment devenu une [plateforme de collaboration industrielle](https://fund.blender.org/) majeure pour l'industrie audiovisuelle
 - **Linux**, une alternative à Windows qui équipe Google, Microsoft, Amazon, Apple, la plupart des sites internet, plateformes cloud, téléphones, routeurs, et bien plus. Toutes ces entreprises contribuent et se reposent énormément sur Linux
 - **Android** est une base commune pour la majorité des téléphones vendus. Les fabriquants contribuent régulièrement à Android
 - **PostgreSQL**, **MySQL**, **SQLite** et d'autres bases de donnée open source dominent collectivement ce marché. Un acteur aux besoins inédits peut contribuer à un outil open source plutôt qu'en créer un nouveau.
 - À la fois **Firefox** et **Chrome** sont Open Source
 - **Wordpress** est le CMS au coeur de 43% des sites internet en activité. Une armée d'entreprises contribuent et produisent des extensions
 - **Odoo** est un ERP modulaire très complet, à la communauté similaire à Wordpress

**Toutes ces projets ont en commun d'être essentiel au business d'un grand nombre d'entreprises, sans pour autant être ce que l'entreprise commercialise**.

Ainsi, ces entreprises décident de collaborer avec leurs pairs ou concurrents à des outils communs, afin de faciliter les échanges et d'améliorer la qualité de leur service.

## Fonctionnement pratique

{{% alert color="info" %}}
Ce mode de fonctionnement n'est pas spécifique à l'open source : beaucoup d'entreprises adoptent un fonctionnement identique, à la différence près qu'il est maintenu privé.
{{% /alert %}}


En pratique, les logiciels libre sont développés via [une forge](https://github.com/osrd-project/osrd). Cette forge donne accès au code source, un outil de gestion des bugs / tâches, et un outil servant à intégrer des changements dans le code.
Tout le monde peut proposer un changement, signaler un bug ou proposer une tâche.

Les propositions de changement sont soumis à une **revue par les pairs**, semblables à celles de la communauté scientifique.
Les individus en charge de la revue (les reviewers) sont ceux qui sont les plus familliers avec les composants affectés par le changement.

Les changements sont intégrés par des mainteneurs sur la base du **consensus** entre reviewers.
Les mainteneurs sont responsables de la cohérence technique du projet, et obtiennent cette position par consensus.
L'intégration des changement n'est motivée que par leur viabilité technique : l'objectif des mainteneurs et reviewers est de **s'assurer que le projet reste de bonne qualité**.
