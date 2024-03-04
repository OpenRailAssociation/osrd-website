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

### Routage & SLUG

_Rédaction en cours_

`projects/{nom du projet}/studies/{nom de l'étude}/scenarios/{nom du scenario}`

### Styles & SCSS

> ATTENTION : en CSS/React, le scope d'une classe ne dépend pas de l'endroit où le fichier est importé mais est valide pour toute l'application. Si vous importez un fichier `scss` au fin fond d'un composant (ce que nous déconseillons fortement par ailleurs), ses classes seront disponibles pour toute l'application et peuvent donc provoquer des effets de bord. Vous pouvez utiliser les CSS modules pour éviter les conflits.

Il est donc très recommandé de pouvoir facilement suivre l'arborescence des applications, vues, modules et composants également au sein du code SCSS, et notamment imbriquer les noms de classes pour éviter les effets de bord, le compilateur se chargera de fabriquer la hiérarchie nécessaire.

Si par exemple nous avons un composant `rollingStockSelector` qui propose une liste de matériel `rollingStockList` représentés par des cartes `rollingStockCard` contenant une image représentant le matériel roulant `rollingStockImg` nous devrions avoir la structure SCSS suivante :

```scss
.rollinStockSelector {
  .rollingStockList {
    .rollingStockCard {
      .rollingStockImg {
        width: 5rem;
        height: auto;
      }
    }
  }
}
```

Ainsi, on a la garantie que l'image contenue dans la carte de matériel roulant héritera bien des bonnes propriétés css `.rollinStockSelector.rollingStockList.rollingStockCard.rollingStockImg`.

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

### RTK

Utiliser les endpoints générés à partir des fichiers `openapi.yaml` pour consommer le backend.

#### Fonctionnement du cache dans RTK Query

Lorsque de la donnée est récupérée depuis le back, RTK va mettre cette donnée en cache dans le store. Si le même endpoint est appelé avec les même paramètres, RTK va réutiliser la donnée dans le cache plutôt que de rappeler le back.

Dans le store, vous verrez cette clé `editoastApi` qui contient la donnée en cache de tous les endpoints editoast :

![store Redux](/images/docs/contribute/store-redux-main.png)

Ici par exemple l’endpoint `getProjects` a été appelé.

RTK stocke le nom de l’endpoint, ainsi que les paramètres d’appel, pour former une clé unique `nomDuEndpoint({ paramètres })`. (ici `getProjects({"ordering":"LastModifiedDesc","pageSize":1000})`).

```js
{
  'getProjectsByProjectIdStudiesAndStudyId({"projectId":13,"studyId":16})': {
    status :"fulfilled",
    etc…
  },
  'getProjectsByProjectIdStudiesAndStudyId({"projectId":13,"studyId":14})': {
    …
  }
}
```

Dans ce deuxième exemple, le même endpoint a été appelé avec le même paramètre `projectId`, mais un paramètre `studyId` différent.

##### Sérialisation des clés dans le cache

Les string utilisées comme clé dans le cache sont à peu de choses près l’objet paramètre passé à la moulinette `JSON.stringify` que transforme un object JS en string (donc sérialisé).

Normalement La sérialisation ne conserve pas l’ordre des clés des objets. Par exemple, `JSON.stringify` ne produira pas la même string avec ces deux objets: `{ a: 1, b: 2 }` et `{ b: 2, a: 1 }`.

RTK va optimiser la mise en cache en faisant en sorte que le résultat d’un appel avec `{"projectId":13,"studyId":16}` ou `{"studyId":16, "projectId":13}` soient stockées dans la même clé dans le cache.

Pour voir le fonctionnement en détail, voici le code de cette fonction de sérialisation :

<details>
  <summary>Fonction de sérialisation RTK</summary>

```js
const defaultSerializeQueryArgs: SerializeQueryArgs<any> = ({
    endpointName,
    queryArgs,
  }) => {
    let serialized = ''

    const cached = cache?.get(queryArgs)

    if (typeof cached === 'string') {
      serialized = cached
    } else {
      const stringified = JSON.stringify(queryArgs, (key, value) =>
        isPlainObject(value)
          ? Object.keys(value)
              .sort() // les clés sont remises dans l’ordre ici
              .reduce<any>((acc, key) => {
                acc[key] = (value as any)[key]
                return acc
              }, {})
          : value
      )
      if (isPlainObject(queryArgs)) {
        cache?.set(queryArgs, stringified)
      }
      serialized = stringified
    }
    // Sort the object keys before stringifying, to prevent useQuery({ a: 1, b: 2 }) having a different cache key than useQuery({ b: 2, a: 1 })
    return `${endpointName}(${serialized})`
  }
```

</details>

##### Souscriptions à la donnée

Dans la terminologie de RTK query, Lorsqu’un composant react appelle un endpoint défini dans RTK Query, il _souscrit_ à la donnée.

RTK compte le nombre de référence à la même paire (endpoint,{paramètres}). Lorsque deux composants souscrivent à la même donnée. Ils partagent la même clé dans le cache.

```ts
import { osrdEditoastApi } from "./api.ts";

function Component1() {
  // component subscribes to the data
  const { data } = osrdEditoastApi.useGetXQuery(1);

  return <div>...</div>;
}

function Component2() {
  // component subscribes to the data
  const { data } = osrdEditoastApi.useGetXQuery(2);

  return <div>...</div>;
}

function Component3() {
  // component subscribes to the data
  const { data } = osrdEditoastApi.useGetXQuery(3);

  return <div>...</div>;
}

function Component4() {
  // component subscribes to the *same* data as ComponentThree,
  // as it has the same query parameters
  const { data } = osrdEditoastApi.useGetXQuery(3);

  return <div>...</div>;
}
```

Ici `Component3` et `Component4` ne vont générer qu’un seul appel vers le back. Ils souscrivent à la même donnée (même endpoint et même paramètre `3`). Ils vont partager la même clé dans le cache.

Au total ici il y aura trois appels vers le back, avec les paramètres `1`, `2`, `3`.

Tant qu’il existe au moins un composant react monté, qui appelle le hook `osrdEditoastApi.endpoints.getProjectsByProjectId.useQuery` par exemple, la donnée sera conservée dans le cache.

Dès que le dernier composant est démonté, la donnée est supprimée du cache au bout de 60 secondes (valeur par défaut).

## Lois et éléments importants

#### Aucun composant ne doit détenir la responsabilité de mise à jour de la donnée qu'il utilise

Seules <u>les vues</u> contiennent les sélecteurs du store, donnés ensuite en props aux composants du module lié à la vue.

#### Le SCSS n'est pas scopé

Un fichier `.scss` enfoui dans l'arborescence ne vous garantit pas que les classes contenues soient seulement accessibles à cet endroit, y compris par import react (formellement interdit au passage : vous devez utiliser l'import SCSS), toutes les classes déclarées sont accessibles partout.

Préférez un choix judicieux de nom de classe racine pour un module donné et utilisez l'arborescence possible dans le fichier SCSS.

#### Les liens des imports doivent être absolus

Vous devez utiliser le <u>chemin complet</u> pour tous vos imports.

> Le chemin peut être relatif seulement si le fichier à importer est dans le même répertoire.

## TypeScript

### import & export

Nous recommendons d’utiliser les imports et export typés.

Lorsque qu’un `import` ou un `export` ne comporte que des types, l’indiquer par le mot clé `type`.

```typescript
export type { Direction, DirectionalTrackRange as TrackRange };
```

```typescript
import type { typedEntries, ValueOf } from "utils/types";
```

Cette pratique permet de&nbsp;:

- Améliorer les performances et le travail d’analyse du compilateur et du linter.
- Rendre ces déclarations plus lisibles, on voit clairement ce qu’on est en train d’importer.
- Éviter des cycles de dépendances&nbsp;:

![dependency cyle](/images/docs/contribute/dependency-cycle.png)

L’erreur disparaît avec le mot clé `type`

![dependency cyle](/images/docs/contribute/dependency-cycle-gone.png)

- Alléger le bundle final (tous les types disparaissent à la compilation).
