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

> ATTENTION : en CSS/React, le scope d'une classe ne dépend pas de l'endroit où le fichier est importé mais est valide pour toute l'application. Si vous importez un fichier `scss` au fin fond d'un composant (ce que nous déconseillons fortement par ailleurs), ses classes seront disponibles pour toute l'application et peuvent donc provoquer des effets de bord. Vous pouvez utiliser les CSS modules pour éviter les conflits.

Il est donc très recommandé de pouvoir facilement suivre l'arborescence des applications, vues, modules et composants également au sein du code SCSS, et notamment imbriquer les noms de classes pour éviter les effets de bord, le compilateur se chargera de fabriquer la hiérarchie nécessaire.

Si par exemple nous avons un composant `rollingStockSelector` qui propose une liste de matériel `rollingStockList` représentés par des cartes `rollingStockCard` contenant une image représentant le matériel roulant `rollingStockImg` nous devrions avoir la structure SCSS suivante :

```scss
.rollinStockSelector {
  .rollingStockList {
    .rollingStockCard {
      .rollingStockImg {
        width: 50px;
        height: auto;
      }
    }
  }
}
```

Ainsi, on a la garantie que l'image contenue dans la carte de matériel roulant héritera bien des bonnes propriétés css `.rollinStockSelector.rollingStockList.rollingStockCard.rollingStockImg`.

Quelques conventions supplémentaires:
- toutes les tailles sont exprimées en px, sauf pour les polices que l'on exprime en rem.

#### CSS Modules

Les CSS modules permettent de scoper les styles CSS à un composant spécifique, évitant ainsi les conflits de noms de classe globaux.

Vite prend en charge nativement les CSS modules. Assurez-vous que votre fichier CSS a l'extension `.module.css`. Par exemple, `styles.module.css`.

##### Utilisation des CSS modules dans les composants

1. **Créez un fichier SCSS avec l'extension `.module.scss`** :

```css
/* MyComponent.module.scss */
.container {
  background-color: white;
}

.title {
  font-size: 24px;
  color: #333;
}
```

2. **Utilisez les classes dans votre composant React** :

Vite transforme les classes en objets qui contiennent les classes hashées (exemple `_container_h3d8bg`) et les utilise au moment de la génération du bundle, rendant ainsi les classes uniques.

```tsx
import React from "react";
import styles from "./MyComponent.module.scss";

export function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles["title"]}>Mon Titre</h1>
    </div>
  );
}
```

Pour plus d'information, vous pouvez regarder la [documentation](https://vitejs.dev/guide/features.html#css-modules) de vite.js

#### Noms de classes, utilisation de `cx()`

Les classes sont ajoutées les unes à la suite des autres, normalement, dans la propriété `className=""`.

Cependant, quand cela est nécessaire —&nbsp;tests pour l'utilisation d'une classe, concaténation, etc.&nbsp;— nous utilisons la bibliothèque [classnames](https://github.com/JedWatson/classnames) qui préconise l'usage suivant :

```ts
<div className="rollingStockSelector">
  <div className="rollingStockList">
    <div className="rollingStockCard w-100 my-2">
      <img
        className={cx("rollingStockImg", "m-2", "p-1", "bg-white", {
          valid: isValid(),
          selected: rollingStockID === selectedRollingStockID,
        })}
      />
    </div>
  </div>
</div>
```

Les classes sont **séparées** chacune dans un `string` et les opérations booléennes ou autres sont réalisées dans un objet qui retournera —&nbsp;ou pas&nbsp;— le nom de propriété comme nom de classe à utiliser dans le CSS.

### Store/Redux

Tout ce qui est _selector_ est géré par la **vue** et passé en props aux composants et sous-composants.

Par conséquent les appels au store en lecture et en écriture doivent être passés un niveau de la vue, en irrigant par des _props_ et _states_ les composants proposées par la vue.

### Redux ToolKit (RTK)

Nous utilisons [Redux ToolKit](https://redux-toolkit.js.org/) pour réaliser nos appels au backend.

RTK permet notamment de faire des appels à l'api et de mettre en cache les réponses. Pour plus de détails, nous vous invitons à consulter la [documentation officielle](https://redux-toolkit.js.org/rtk-query/overview).

Les endpoints et les types du backend sont générés directement à partir de l'open-api d'editoast et stockés dans `generatedOsrdApi` (avec la commande `npm run generate-types`). Ce fichier généré est ensuite enrichi par d'autres endpoints ou types dans `osrdEditoastApi`, qui peuvent être utilisés dans l'application.
A noter qu'il est possible de transformer des mutations en queries lors de la génération de generatedOsrdApi en modifiant le fichier `openapi-editoast-config`.

Lorsqu'un appel d'endpoint doit être skip parce qu'une variable n'est pas définie, on utilise [skipToken](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#skipping-queries-with-typescript-using-skiptoken) de RTK pour éviter de devoir mettre des casts.


### Traduction de l'application

La traduction de l'application est effectuée sur [Transifex](https://explore.transifex.com/osrd/osrd/). La langue par défaut est le français.
A noter que si l'on doit corriger une traduction, il est recommandé de passer par Transifex. En revanche, si on ajoute une nouvelle clé de traduction, celle-ci peut être ajoutée dans le code directement, dans toutes les langues disponibles.

## Lois et éléments importants

#### Aucun composant ne doit détenir la responsabilité de mise à jour de la donnée qu'il utilise

Seules <u>les vues</u> contiennent les sélecteurs du store, donnés ensuite en props aux composants du module lié à la vue.

#### Le SCSS n'est pas scopé

Un fichier `.scss` enfoui dans l'arborescence ne vous garantit pas que les classes contenues soient seulement accessibles à cet endroit, y compris par import react (formellement interdit au passage : vous devez utiliser l'import SCSS), toutes les classes déclarées sont accessibles partout.

Préférez un choix judicieux de nom de classe racine pour un module donné et utilisez l'arborescence possible dans le fichier SCSS.

#### Les imports doivent être triés d'une certaine manière

ESLint est configuré pour trier automatiquement les imports en 4 groupes, chacun trié alphabétiquement :

- React
- Librairies externes
- Fichiers internes en chemin absolu
- Fichiers internes en chemin relatif

Chacun de ces groupes est séparé par une ligne vide.

ESLint déclenchera un avertissement si ces recommandations ne sont pas respectées.

#### Les liens des imports doivent être absolus

Vous devez utiliser le <u>chemin complet</u> pour tous vos imports.

> Le chemin peut être relatif seulement si le fichier à importer est dans le même répertoire.

## TypeScript

### import & export

ESLint et Typescript sont configurés pour imposer l'`import type` pour un import de type.

Ceci permet de :

- Automatiquement ajouter `type` devant l'import quand on ajoute un type avec l'autocomplétion dans un fichier.
- Afficher 2 erreurs de chacun de ces packages demandant d'ajouter `type` devant l'import si vous ne l'avez pas fait.

Lorsque qu’un `import` ou un `export` ne comporte que des types, il faut l’indiquer par le mot clé `type`.

```typescript
export type { Direction, DirectionalTrackRange as TrackRange };
```

```typescript
import type { typedEntries, ValueOf } from "utils/types";
```

Quand un import ne contient pas que des types, il sera agencé de cette manière, par ordre alphabétique.

```typescript
import {
  osrdEditoastApi,
  type ScenarioCreateForm,
} from "common/api/osrdEditoastApi";
```

Cette pratique permet de&nbsp;:

- Améliorer les performances et le travail d’analyse du compilateur et du linter.
- Rendre ces déclarations plus lisibles, on voit clairement ce qu’on est en train d’importer.
- Éviter des cycles de dépendances&nbsp;:

![dependency cycle](/images/docs/contribute/dependency-cycle.png)

L’erreur disparaît avec le mot clé `type`

![dependency cycle](/images/docs/contribute/dependency-cycle-gone.png)

- Alléger le bundle final (tous les types disparaissent à la compilation).
