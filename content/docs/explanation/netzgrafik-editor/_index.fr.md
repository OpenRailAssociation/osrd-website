---
title: "Netzgrafik-Editor"
linkTitle: "Netzgrafik-Editor"
weight: 40
description: "Logiciel open-source développé par SBB CFF FFS et son intégration dans OSRD"
---

Netzgrafik-Editor (NGE) est un logiciel open-source qui permet la création, la modification et l'analyse d'horaires à intervalles réguliers, à un niveau de détail macroscopique, développé par les Chemins de Fer Fédéraux suisses (SBB CFF FFS). Voir les dépôts [front-end](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-frontend) et [back-end](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-backend).

OSRD et NGE sont sémantiquement différents: le premier fonctionne à un niveau de détail microscopique, est basé sur une infrastructure définie en qualité et représente une grille horaire composée d'instances uniques de trains, alors que le second fonctionne à un niveau de détail macroscopique, sans infrastructure explicite et représente un plan de transport composé de lignes de train cadencées. Cependant, ces différences, suffisamment proches, peuvent être manipulées pour fonctionner ensemble.

La compatibilité entre NGE et OSRD a été testée à travers une preuve de concept, en exécutant les deux applications comme services distincts sans synchronisation automatisée.

L'idée est de fournir à OSRD un outil graphique pour éditer (créer, mettre à jour et supprimer les horaires des trains) une grille horaire à partir d'un scénario d'étude opérationnelle, et obtenir en même temps des informations analytiques. Utiliser des niveaux de détail microscopique et macroscopique permet un second bénéfice : les calculs microscopiques d'OSRD étendent le périmètre de NGE, ses fonctionnalités et les informations fournies, comme par exemple les simulations microscopiques ou l'outil de détection de conflits.

L'objectif transversal de cette fonctionnalité est de faire collaborer deux projets open-source de deux grands gestionnaires d'infrastructure ferroviaire pour atteindre le même objectif, celui d'assurer une continuité numérique à différentes échelles temporelles pour les études d'exploitations ferroviaires.

#### 1 - Intégration dans OSRD

OSRD a développé une version `standalone` de NGE, intégrée au code source, qui permet à NGE de fonctionner sans back-end. Ainsi, à des fins d'utilisation externe, un [build de NGE `standalone` est disponible sur NPM](https://www.npmjs.com/package/netzgrafik-frontend), et est publié à chaque release. Enfin, pour répondre à des besoins spécifiques à OSRD, OSRD utilise un [fork](https://github.com/osrd-project/netzgrafik-editor-frontend) de NGE (dont le [build, NGE `standalone`, est aussi disponible sur NPM](https://www.npmjs.com/package/@osrd-project/netzgrafik-frontend)), en restant le plus proche possible du répertoire officiel.

Malgré l'utilisation de frameworks JavaScript différents (ReactJS pour OSRD et Angular pour NGE), ce build permet à OSRD d'intégrer NGE au sein d'un [`iframe`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/iframe). Cet `iframe` instancie un [`Custom Element`](https://developer.mozilla.org/fr/docs/Web/API/Web_components/Using_custom_elements), qui est l'interface de communication entre les deux applications et démarre le build de NGE.

Une alternative pour répondre au problème d'intégration aurait été de réécrire NGE en [`web-components`](https://developer.mozilla.org/fr/docs/Web/API/Web_components), pour les importer dans OSRD, mais cette solution a été abandonnée compte tenu de la quantité de travail que cela représenterait.

NGE, sous sa version `standalone`, communique avec OSRD à travers l'`iframe` grâce à des propriétés d'éléments du DOM :
- [`@Input`](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-frontend/blob/fe3e788499e18054e260c05e714419aeeafc44e1/src/app/app.component.ts#L75): avec la propriété `netzgrafikDto`, déclenchée à la mise à jour du contenu du scénario depuis OSRD.
- [`@Output`](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-frontend/blob/fe3e788499e18054e260c05e714419aeeafc44e1/src/app/app.component.ts#L84): avec la propriété [`operations`](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-frontend/blob/main/documentation/STANDALONE.md), déclenchée à l'utilisation de NGE.

NGE est alors capable d'obtenir la grille horaire OSRD dès qu'un changement est effectué du côté d'OSRD, et OSRD est capable d'obtenir les modifications effectuées du côté de NGE.

![Diagramme conceptuel](osrd_nge_concept_diagram.png)

Il est important de noter que dans sa version `standalone`, NGE se repose alors ici sur le front-end d'OSRD, lui-même mis à jour par le back-end d'OSRD. De nouvelles tables en base de données, des modifications et de nouvelles routes sont alors nécessaires pour persister les informations macroscopiques d'un scénario.

#### 2 - Convertisseurs

Pour surpasser les différences sémantiques et adapter les modèles de données, deux convertisseurs sont implémentés :
- **[OSRD -> NGE]** un convertisseur qui transforme une grille horaire OSRD en un modèle NGE. Les nœuds sont les points de passage décrits par les circulations, et dont les informations macroscopiques (position sur le réticulaire) sont stockés en base de données. Les circulations OSRD, `TrainSchedule`, représentent alors des lignes de train cadencées dans NGE, `Trainrun`. Un concept de lignes de trains cadencées, sera bientôt implémenté pour permettre la convergence conceptuelle entre OSRD et NGE.
- **[OSRD <- NGE]** un gestionnaire d'événements, qui transforme une action NGE en mise à jour de la base de données OSRD.

#### 3 - Open-source (coopération / contribution)

Pour rendre NGE compatible avec OSRD, certaines modifications ont été demandées (désactivation du back-end, création de hooks sur les événements) et directement implémentées dans le [répertoire officiel de NGE](https://github.com/SchweizerischeBundesbahnen/netzgrafik-editor-frontend), avec l'accord et l'aide de l'équipe NGE.

Les contributions d'un projet à l'autre, de part et d'autre, sont précieuses et seront encouragées à l'avenir.

Cette fonctionnalité montre également que la coopération open-source est puissante et constitue un gain de temps considérable dans le développement de logiciels.
