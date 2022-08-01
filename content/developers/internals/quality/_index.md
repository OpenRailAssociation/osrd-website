---
title: Qualité
linkTitle: Qualité
description: Gestion de la qualité
---

Comment nous apréhendons la qualité chez [DGEX Solutions](https://www.linkedin.com/company/dgex-solutions?originalSubdomain=fr)

> :warning: **En construction**
## Qualité intégrée

Chez OSRD la qualité logicielle fait partie de notre ADN. En complément des pratiques courantes que nous mettons en œuvre pour assurer la qualité du code de nos solutions open source, nous avons la possibilité de nous appuyer sur une vision structurée de pratiques proposée par la méthodologie SAFe et appelée “qualité intégrée”. 

Ces pratiques de “qualité intégrée” garantissent que chaque élément de la solution, à chaque incrément, répond aux normes de qualité appropriées, que nous nous fixons tout au long du développement.

Ce document regroupe l’ensemble de nos pratiques mises en œuvre, regroupées dans 5 domaines techniques orientés Entreprise qui visent la mise en place : 



* d’un flux de travail
* d’une architecture et un design de qualité
* de la qualité de code
* de la qualité Système
* de la qualité de Versionnement

Nous proposons ici de vous exposer l’état de l’art de notre **qualité intégrée** à travers le prisme de ces 5 domaines, sur le projet [osrd](https://github.com/DGEXSolutions/osrd).


## Les projets

Nos projets sont hébergés sur [Github](https://github.com/DGEXSolutions) et le projet principal d’appelle s’appelle [osrd](https://github.com/DGEXSolutions/osrd). Nous nous appuierons sur ce dernier pour apporter des détails dans ce document.



## Les pratiques


### Le flow

Les équipes agiles fonctionnent souvent de façon itérative afin de développer et publier rapidement des fonctionnalités de grande qualité et c’est notre cas chez OSRD puisque nous sommes certifiés [SAFe](https://www.atlassian.com/fr/agile/agile-at-scale/what-is-safe).

Nous portons une attention particulière sur :



* **la pratique des tests**
* **la pipeline de Continuous Delivery**


#### approche Test-First

Nous accordons une importance primordiale à la pratique du test, dans tous les domaines possibles. 

Nous sommes actuellement en train de travailler sur la définition de notre pyramide des tests. Plus précisément, nous amorçons la réflexion sur les tests de bout en bout.

Nous détaillerons plus en détail cette section dès que possible.


#### La pipeline de Déploiement Continue

Nous avons conscience que l’automatisation de la pipeline de Déploiement Continue est un levier pour accélérer les développements et leur qualité associée en évitant les régressions. 

Notre pipeline est aujourd’hui en place sous Gitlab et permet l’automatisation des déploiements au sein  de DGEXSolutions. Son accès reste cependant privé à ce jour.


### Architecture et qualité de conception


#### Support des besoins business futurs

Le projet OSRD est composé d’une 


#### Conception

Nous essayons de suivre les principes de design orientés objets basés sur le mnémonique  [SOLID](https://fr.wikipedia.org/wiki/SOLID_(informatique)) qui vise à produire des architectures logicielles plus compréhensibles, flexibles et maintenables :


* [Responsabilité unique](https://fr.wikipedia.org/wiki/Principe_de_responsabilit%C3%A9_unique)
* [principe Ouvert/fermé](https://fr.wikipedia.org/wiki/Principe_ouvert/ferm%C3%A9)
* [Substitution de Liskov](https://fr.wikipedia.org/wiki/Principe_de_substitution_de_Liskov)
* [Ségrégation des interfaces](https://fr.wikipedia.org/wiki/Principe_de_s%C3%A9gr%C3%A9gation_des_interfaces)
* [Inversion des dépendances](https://fr.wikipedia.org/wiki/Inversion_des_d%C3%A9pendances)


#### Architecturer et concevoir pour faciliter les tests

> :warning: **En construction**


### Qualité du code

La qualité de code influence la rapidité ainsi que la facilité à laquelle de nouvelles fonctionnalités peuvent être développées.

Chez DGEX Solutions, nous avons adopté une partie des pratiques issues de l’[extrême programming](https://fr.wikipedia.org/wiki/Extreme_programming).


#### Tests unitaires

Chaque portion du code est testée unitairement selon le composant et son language utilisé.

Nous .

Aujourd'hui, nous disposons de 2 catégories de tests : 


* les tests unitaires
* les tests d’[intégration](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/integration_tests.yml)


#### Travail en binôme

Nous pratiquons le travail en binôme de façon assez libre. Cette pratique possède les avantages suivants : 



* review et commentaires du code en temps réel
* crée et maintient la qualité
* augmente et élargit les compétences de toute l'équipe


#### Propriété collective et normes de codage

Les objectifs sous jacents sont les suivants : 



* Chaque contributeur doit pouvoir ajouter une fonctionnalité, corriger un bug, améliorer la conception ou refactorer le code. 
* Chacun doit pouvoir comprendre et maintenir la qualité de chacun des composants

Pour atteindre ces objectifs, nous faisons en sorte que l’ensemble des équipes ait les moyens de s’approprier le code et d’y contribuer facilement.

Cela passe par une constante remise en question de l'accès aux informations pour :



* [comprendre le projet](https://dgexsolutions.github.io/osrd-website/fr/who-we-are/)
* [comprendre le métier](https://dgexsolutions.github.io/osrd-website/en/developers/internals/data-model/usage-example/)
* [contribuer au code](https://dgexsolutions.github.io/osrd-website/fr/developers/contribute/)
* [participer à la conception](https://dgexsolutions.github.io/osrd-website/fr/developers/internals/)



### Qualité du système

Alors que la qualité de la conception et du code garantissent que les artefacts du système peuvent être facilement compris et modifiés, la qualité du système confirme que le système fonctionne comme prévu et que tout le monde est aligné sur les modifications à apporter.


#### S’aligner pour accélérer

Nos pratiques Agiles et notamment nos pratiques SAFe créent un alignement entre les différentes équipes sur les objectifs à atteindre au niveau système. Cela crée de la cohésion et permet d’optimiser le flux de développement du système dans sa globalité.

Au niveau de l’équipe, il est également possible de s’aligner en utilisant le [Behavior-Driven Development](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement#:~:text=La%20programmation%20pilot%C3%A9e%20par%20le,participant%20%C3%A0%20un%20projet%20logiciel.). Il s’agit d’une pratique collaborative où le Product Owner et les membres de l'équipe s'accordent sur le comportement précis d'une histoire ou d'une fonctionnalité. L'application de BDD aide les développeurs à créer le bon comportement dès la première fois et réduit les reprises et les erreurs. Aujourd’hui, nous ne pratiquons pas de BDD.


#### Integration continue

Notre système d’[intégration continue](https://github.com/DGEXSolutions/osrd/actions) fonctionne sous Github via l’utilisation d’[actions](https://docs.github.com/en/actions).


##### Les tests unitaires

Chaque composant du monorepo possède sa propre action Github permettant de : 



* lancer les tests unitaires
* lancer une analyse de couverture du code via Codecov
* lancer un contrôle sur le respect de règles de codifications via Checkstyle

Voici la [liste](https://github.com/DGEXSolutions/osrd/tree/dev/.github/workflows) de chaque composant : 



* [api](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/api.yml)
* [core](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/core.yml)
* [chartos](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/chartos.yml)
* [editoast](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/editoast.yml)
* [front](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/front.yml)


##### Les tests d’intégration

Nous appliquons des [tests d’intégration](https://github.com/DGEXSolutions/osrd/blob/dev/.github/workflows/integration_tests.yml) à chacun de nos systèmes.

> :warning: **En construction**


### Qualité du versionnement


#### Gestion des versions

Vous pouvez trouver plus de détails sur cette [page](https://dgexsolutions.github.io/osrd-website/fr/developers/internals/versionning/).


#### Versionnement à la demande

Le versionnement à la demande est le processus qui déploie de nouvelles fonctionnalités en production et les publie immédiatement ou progressivement en fonction de la demande des clients. 

Aujourd’hui, en raison de contrainte d’accès à des données privées, la partie Déploiement Continue est gérée dans un repository privé à part.

OSRD est déployé de façon [continue](https://fr.wikipedia.org/wiki/Livraison_continue), pour chaque commit réalisé sur la branche [dev](https://github.com/DGEXSolutions/osrd/tree/dev).

Aucun mécanisme de versionnement n’est aujourd’hui utilisé sur Github.


#### Definition of Done

La **Definition of Done** (DoD) est une liste claire et concise d'exigences à respecter pour qu’une fonctionnalité développée par l'équipe puisse être qualifiée de “faite”.

Là où nos critères d’acceptance s’appliquent de façon unique à toutes nos fonctionnalités, la Definition of Done est une liste unique pour chaque story.

Nous utilisons des templates Github afin de garantir que chaque ticket est correctement structuré autour de la DoD et des critères d’acceptance : 



* [feature](https://github.com/DGEXSolutions/osrd/blob/dev/.github/ISSUE_TEMPLATE/feature.md)
* [enabler story](https://github.com/DGEXSolutions/osrd/blob/dev/.github/ISSUE_TEMPLATE/enabler_story.md)
* [user story](https://github.com/DGEXSolutions/osrd/blob/dev/.github/ISSUE_TEMPLATE/user_story.md)## Qualité intégrée

