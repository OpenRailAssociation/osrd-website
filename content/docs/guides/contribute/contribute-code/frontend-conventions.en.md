---
title: "Front-end conventions"
linkTitle: "Front-end conventions"
weight: 2
description: "Coding style guide and best practices for front-end"
---

We use **ReactJS** and all files must be written in **Typescript**.

The code is **linted** with [eslint](https://eslint.org/), and **formatted** with [prettier](https://prettier.io/).

## Nomenclature

![Infrastructure diagram](/images/docs/contribute/nomenclature-front-end.svg)

The **applications** (osrd eex, osrd stdcm, infra editor, rolling-stock editor) offer **views** (project management, study management, etc.) linked to **modules** (project, study, etc.) which contain the components.

These **views** are made up of **components** and sub-components <u>all derived from the modules</u>.
In addition to containing the **views** files for the applications, they may also contain a **scripts** directory which offers scripts related to these views. The **views** determine the logic and <u>access to the store</u>.

**Modules** are collections of **components** attached to an **object** (a scenario, a rolling stock, a TrainSchedule). They contain :
  - a *components* directory hosting <u>all</u> components
  - an optional *styles* directory <u>per module</u> for styling components in scss
  - an optional *assets* directory <u>per module</u> (which contains assets, e.g. default datasets, specific to the module)
  - an optional *reducers* file <u>per module</u>
  - an optional *types* file <u>per module</u>
  - an optional *consts* file <u>per module</u>

An **assets** directory (containing images and other files).

Last but not least, a **common** directory offering :
  - a *utils* directory for utility functions common to the entire project
  - a *types* file for types common to the entire project
  - a *consts* file for constants common to the entire project
  

## Implementation principles
### Routing & SLUG
_In progress_

`projects/{nom du projet}/studies/{nom de l'étude}/scenarios/{nom du scenario}`

### Styles & SCSS

> WARNING: in CSS/React, the scope of a class does not depend on where the file is imported, but is valid for the entire application. If you import an `scss` file in the depths of a component (which we strongly advise against), its classes will be available to the whole application and may therefore cause side effects.

It is therefore highly recommended to be able to easily follow the tree structure of applications, views, modules and components also within the SCSS code, and in particular to nest class names to avoid edge effects, as the compiler will take care of making the necessary hierarchy.

If, for example, we have a `rollingStockSelector` component which proposes a list of rolling stock `rollingStockList` represented by `rollingStockCard` containing an image representing the rolling stock `rollingStockImg` we should have the following SCSS structure:

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
This ensures that the image contained in the rolling stock card inherits the correct css properties `.rollinStockSelector.rollingStockList.rollingStockCard.rollingStockImg`.

#### CSS Modules
CSS modules allow scoping CSS styles to a specific component, thereby avoiding conflicts with global class names.

Vite natively supports CSS modules. Ensure that your CSS file has the `.module.css` extension, for example, `styles.module.css`.

##### Using CSS Modules in Components

1. **Create an SCSS file with the `.module.scss` extension**:

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

2. **Use the classes in your React component**:

Vite transforms classes into objects that contain hashed classes (e.g., `_container_h3d8bg`) and uses them during bundle generation, making the classes unique.

```tsx
import React from 'react';
import styles from './MyComponent.module.scss';

export function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles["title"]}>My Title</h1>
    </div>
  );
};
```

For more information, you can refer to the [Vite.js documentation](https://vitejs.dev/guide/features.html#css-modules).

#### Class names, using `cx()`.
Classes are normally added one after the other, in the `className=""` property.

However, when necessary -&nbsp;class usage tests, concatenation, etc.&nbsp;- we use the [classnames library](https://github.com/JedWatson/classnames), which recommends the following usage:

```ts
<div className="rollingStockSelector">
  <div className="rollingStockList">
    <div className="rollingStockCard w-100 my-2">
      <img
        className={cx('rollingStockImg', 'm-2', 'p-1', 'bg-white', {
          valid: isValid(),
          selected: rollingStockID === selectedRollingStockID,
        })}
      />
    </div>
  </div>
</div>
```
Classes are **separated** each in a `string` and Boolean or other operations are performed in an object that will return -&nbsp;or not&nbsp;- the property name as the class name to be used in CSS.

### Store/Redux
Everything that is *selector* is managed by the **view** and passed as props to components and sub-components.

Consequently, read and write calls to the store must be made at view level, irrigating the components proposed by the view with _props_ and _states_.

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
import { osrdEditoastApi } from './api.ts'  
  
function Component1() {  
  // component subscribes to the data  
  const { data } = osrdEditoastApi.useGetXQuery(1)
  
  return <div>...</div>  
}  
  
function Component2() {  
  // component subscribes to the data  
  const { data } = osrdEditoastApi.useGetXQuery(2)
  
  return <div>...</div>  
}  
  
function Component3() {  
  // component subscribes to the data  
  const { data } = osrdEditoastApi.useGetXQuery(3)  
  
  return <div>...</div>  
}  
  
function Component4() {  
  // component subscribes to the *same* data as ComponentThree,  
  // as it has the same query parameters  
  const { data } = osrdEditoastApi.useGetXQuery(3)  
  
  return <div>...</div>  
}
```

Ici `Component3` et `Component4` ne vont générer qu’un seul appel vers le back. Ils souscrivent à la même donnée (même endpoint et même paramètre `3`). Ils vont partager la même clé dans le cache. 

Au total ici il y aura trois appels vers le back, avec les paramètres `1`, `2`, `3`.

Tant qu’il existe au moins un composant react monté, qui appelle le hook `osrdEditoastApi.endpoints.getProjectsByProjectId.useQuery` par exemple, la donnée sera conservée dans le cache.

Dès que le dernier composant est démonté, la donnée est supprimée du cache au bout de 60 secondes (valeur par défaut).

## Lois et éléments importants

#### No component should be responsible for updating the data it uses
Only <u>views</u> contain the store selectors, which are then given as props to the components of the module linked to the view.

#### SCSS is not scoped
A `.scss` file buried in the tree structure doesn't guarantee that the classes it contains can only be accessed there, even by importing react (formally forbidden by the way: you must use SCSS import), all declared classes are accessible everywhere.

Prefer a judicious choice of root class name for a given module, and use the tree structure available in the SCSS file.

#### Import links must be absolute
You must use the <u>full path</u> for all your imports.
> Import links can be relative only if the file to be imported is in the same directory.

## TypeScript

### import & export

We recommend using typed imports and exports.

When an `import` or `export` contains only types, indicate it with the `type` keyword.


```typescript
export type { Direction, DirectionalTrackRange as TrackRange };
```
```typescript
import type { typedEntries, ValueOf } from 'utils/types';
```

This allows to:
- Improve the performance and analysis process of the compiler and the linter.
- Make these declarations more readable; we can clearly see what we are importing.
- Avoid dependency cycles:

 ![dependency cyle](/images/docs/contribute/dependency-cycle.png)

The error disappears with the `type` keyword

 ![dependency cyle](/images/docs/contribute/dependency-cycle-gone.png)

- Make final bundle lighter (all types disappear at compilation)
