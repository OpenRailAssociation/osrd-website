---
title: "Conventions front-end"
linkTitle: "Conventions front-end"
weight: 2
description: "Conventions de codes et bonnes pratiques pour le front-end"
---

Nous utilisons **ReactJS** et tous les fichiers doivent être écrits en **Typescript**.

Le code est _linté_ avec [eslint](https://eslint.org/), et **formaté** avec [prettier](https://prettier.io/).

## Nomenclature

![Diagramme de l'Infrastructure](/images/docs/contribute/nomenclature-front-end.svg)

Les **applications** (osrd eex, osrd stdcm, éditeur infra, éditeur matériel) proposent des **vues** (gestion des projets, gestions des études, etc.) liées à des **modules** (projet, étude, etc.) qui contiennent les composants.

Ces **vues** sont constituées de **composants** et sous-composants <u>tous issus des modules</u>.
En plus de contenir les fichiers de **vues** des applications, elles peuvent contenir un répertoire **scripts** qui propose des scripts liés à ces vues. Les **vues** déterminent la logique et l'<u>accès au store</u>.

Les **modules** sont des collections de **composants** rattachés à un **objet** (un scénario, un matériel roulant, un TrainSchedule). Ils contiennent :

- un répertoire _components_ qui héberge <u>tous</u> les composants
- un répertoire _styles_ optionnel <u>par module</u> pour le style des composants en scss
- un répertoire _assets_ optionnel <u>par module</u> (qui contient les assets, de jeux de données par défaut par ex, spécifiques au module)
- un fichier _reducers_ optionnel <u>par module</u>
- un fichier _types_ optionnel <u>par module</u>
- un fichier _consts_ optionnel <u>par module</u>

Un répertoire **assets** (qui contient les images et autre fichiers).

Enfin, un répertoire **common** qui propose :

- un répertoire _utils_ pour les fonctions utilitaires communes à l'ensemble du projet
- un fichier _types_ pour les types communs à l'ensemble du projet
- un fichier _consts_ pour les constantes communes à l'ensemble du projet

## Principes d'implémentation

### Naming

On utilise en général les conventions suivantes dans le code:
- les composants et les types sont en PascalCase
- les variables sont en camelCase
- les clés de traduction sont en camelCase également
- les constantes sont en SCREAMING_SNAKE_CASE (sauf cas particulier)
- les classes css sont en kebab-case

### Styles & SCSS

> ATTENTION : en CSS/React, le scope d'une classe ne dépend pas de l'endroit où le fichier est importé mais est valide pour toute l'application. Si vous importez un fichier `scss` au fin fond d'un composant (ce que nous déconseillons fortement par ailleurs), ses classes seront disponibles pour toute l'application et peuvent donc provoquer des effets de bord.

Il est donc très recommandé de pouvoir facilement suivre l'arborescence des applications, vues, modules et composants également au sein du code SCSS, et notamment imbriquer les noms de classes pour éviter les effets de bord.

Quelques conventions supplémentaires:
- toutes les tailles sont exprimées en px, sauf pour les polices que l'on exprime en rem.
- nous utilisons la bibliothèque [classnames](https://github.com/JedWatson/classnames) pour appliquer conditionnellement des classes : les classes sont **séparées** chacune dans un `string` et les opérations booléennes ou autres sont réalisées dans un objet qui retournera —&nbsp;ou pas&nbsp;— le nom de propriété comme nom de classe à utiliser dans le CSS.


### Store/Redux

Le store permet de stocker des données qui seront accessibles à n'importe quel endroit de l'application. Il est découpé en slices, qui correspondent à nos applications.

Attention cependant à ce que notre store ne devienne pas un fourre-tout.
L'ajout de nouvelles propriétés dans le store doit être justifié par le fait que la donnée en question est "haut-niveau" et devra être accessible depuis des endroits éloignés de la code base, et qu'une simple variable de state ou de contexte ne soit pas pertinent pour stocker cette information.

Pour plus de détails, nous vous invitons à consulter la [documentation officielle](https://redux.js.org/).


### Redux ToolKit (RTK)

Nous utilisons [Redux ToolKit](https://redux-toolkit.js.org/) pour réaliser nos appels au backend.

RTK permet notamment de faire des appels à l'api et de mettre en cache les réponses. Pour plus de détails, nous vous invitons à consulter la [documentation officielle](https://redux-toolkit.js.org/rtk-query/overview).

Les endpoints et les types du backend sont générés directement à partir de l'open-api d'editoast et stockés dans `generatedOsrdApi` (avec la commande `npm run generate-types`). Ce fichier généré est ensuite enrichi par d'autres endpoints ou types dans `osrdEditoastApi`, qui peuvent être utilisés dans l'application.
A noter qu'il est possible de transformer des mutations en queries lors de la génération de generatedOsrdApi en modifiant le fichier `openapi-editoast-config`.

Lorsqu'un appel d'endpoint doit être skip parce qu'une variable n'est pas définie, on utilise [skipToken](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#skipping-queries-with-typescript-using-skiptoken) de RTK pour éviter de devoir mettre des casts.


### Traduction de l'application

La traduction de l'application est effectuée sur [Weblate](https://hosted.weblate.org/projects/osrd/).


### Imports

Il est recommandé d'utiliser le chemin complet pour chaque import, sauf si votre fichier à importer est dans le même répertoire.

ESLint est configuré pour trier automatiquement les imports en 4 groupes, séparés par une ligne vide et chacun trié alphabétiquement :

- React
- Librairies externes
- Fichiers internes en chemin absolu
- Fichiers internes en chemin relatif

Concernant l'import/export de types, ESLint et Typescript sont configurés de manière à ajouter automatiquement `type` devant un import de types, ce qui permet de:
- Améliorer les performances et le travail d’analyse du compilateur et du linter.
- Rendre ces déclarations plus lisibles, on voit clairement ce qu’on est en train d’importer.
- Alléger le bundle final (tous les types disparaissent à la compilation).
- Éviter des cycles de dépendances (ex: l'erreur disparaît avec le mot clé `type`)
  ![dependency cycle](/images/docs/contribute/dependency-cycle.png) ![dependency cycle gone](/images/docs/contribute/dependency-cycle-gone.png)
