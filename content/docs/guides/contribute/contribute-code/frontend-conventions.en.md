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

- a _components_ directory hosting <u>all</u> components
- an optional _styles_ directory <u>per module</u> for styling components in scss
- an optional _assets_ directory <u>per module</u> (which contains assets, e.g. default datasets, specific to the module)
- an optional _reducers_ file <u>per module</u>
- an optional _types_ file <u>per module</u>
- an optional _consts_ file <u>per module</u>

An **assets** directory (containing images and other files).

Last but not least, a **common** directory offering :

- a _utils_ directory for utility functions common to the entire project
- a _types_ file for types common to the entire project
- a _consts_ file for constants common to the entire project

## Implementation principles

### Routing & SLUG

_In progress_

`projects/{project's name}/studies/{study's name}/scenarios/{scenario's name}`

### Naming

The following conventions are generally used in the code:
- components and types are in PascalCase
- variables are in camelCase
- translation keys are also in camelCase
- constants are in SCREAMING_SNAKE_CASE (except in special cases)
- CSS classes are in kebab-case

### Styles & SCSS

> WARNING: in CSS/React, the scope of a class does not depend on where the file is imported, but is valid for the entire application. If you import an `scss` file in the depths of a component (which we strongly advise against), its classes will be available to the whole application and may therefore cause side effects.

It is therefore highly recommended to be able to easily follow the tree structure of applications, views, modules and components also within the SCSS code, and in particular to nest class names to avoid edge effects, as the compiler will take care of making the necessary hierarchy.

If, for example, we have a `rollingStockSelector` component which proposes a list of rolling stock `rollingStockList` represented by `rollingStockCard` containing an image representing the rolling stock `rollingStockImg` we should have the following SCSS structure:

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

This ensures that the image contained in the rolling stock card inherits the correct css properties `.rollinStockSelector.rollingStockList.rollingStockCard.rollingStockImg`.

Some additional conventions:
- All sizes are expressed in px, except for fonts which are expressed in rem.

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
import React from "react";
import styles from "./MyComponent.module.scss";

export function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles["title"]}>My Title</h1>
    </div>
  );
}
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
        className={cx("rollingStockImg", "m-2", "p-1", "bg-white", {
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

Everything that is _selector_ is managed by the **view** and passed as props to components and sub-components.

Consequently, read and write calls to the store must be made at view level, irrigating the components proposed by the view with _props_ and _states_.

### RTK

Use generated endpoints from `openapi.yaml` files to consume the backend.

#### Operation of RTK Query cache

When the data is retrieved from the back, RTK is caching it into the store. If the same endpoint is called again with same parameters, RTK will use the cache data instead of making a new call to the back.

In the store, you will see the `editoastApi` key containing the cached data of all editoast endpoints:

![store Redux](/images/docs/contribute/store-redux-main.png)

Here for example, the `getProjects` endpoint is called.

RTK stores the endpoint's name, as well as the call's parameters, to form an unique key `nomDuEndpoint({ parameter })`. (here `getProjects({"ordering":"LastModifiedDesc","pageSize":1000})`).

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

In this second example, the same endpoint has been called with the same `projectId` parameter, but a different `studyId` parameter.

##### Serialization of keys in the cache

The strings used as keys in the cache are essentially the parameter object passed through the `JSON.stringify` function, which converts a JS object into a string (thus serialized).

Normally, serialization does not preserve the order of object keys. For example, `JSON.stringify` will not produce the same string with these two objects: `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }`.

RTK will optimize caching by ensuring that the result of a call with `{"projectId":13,"studyId":16}` or `{"studyId":16, "projectId":13}` is stored under the same key in the cache.

To see the detailed operation, here is the code for this serialization function:

<details>
  <summary>RTK Serialization Function</summary>

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
              .sort() // keys are reordered here
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

##### Data subscription

In RTK Query terminology, when a React component calls an endpoint defined in RTK Query, it _subscribes_ to the data.

RTK counts the number of references to the same pair (endpoint, {parameters}). When two components subscribe to the same data, they share the same key in the cache.

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

Here, `Component3` and `Component4` will generate only one call to the backend. They subscribe to the same data (same endpoint and same parameter `3`). They will share the same key in the cache.

In total, there will be three calls to the backend here, with parameters `1`, `2`, and `3`.

As long as at least one mounted React component calls the `osrdEditoastApi.endpoints.getProjectsByProjectId.useQuery` hook, for example, the data will be retained in the cache.

Once the last component is unmounted, the data is removed from the cache after 60 seconds (default value).

### Translation

Application translation is performed on [Transifex](https://explore.transifex.com/osrd/osrd/). The default language is French.
If you add a new translation key, it can be added directly to the code, in all available languages. Please note that if you need to correct a translation, we recommend that you use Transifex, to avoid any conflict.

## Rules and important elements

#### No component should be responsible for updating the data it uses

Only <u>views</u> contain the store selectors, which are then given as props to the components of the module linked to the view.

#### SCSS is not scoped

A `.scss` file buried in the tree structure doesn't guarantee that the classes it contains can only be accessed there, even by importing react (formally forbidden by the way: you must use SCSS import), all declared classes are accessible everywhere.

Prefer a judicious choice of root class name for a given module, and use the tree structure available in the SCSS file.

#### Imports must follow a specific order

ESLint is setup to automatically sort imports in four import groups, each of them sorted in alphabetical order :

- React
- External libraries
- Internal absolute path files
- Internal relative path files

Each of these groups will be separated by an empty line.

ESLint will trigger a warning if you don't follow these guidelines.

#### Import links must be absolute

You must use the <u>full path</u> for all your imports.

> Import links can be relative only if the file to be imported is in the same directory.

## TypeScript

### import & export

ESLint and Typescript are setup to enforce typed imports for an exported type.

This current setup allows to :

- Auto typing the import when using a type in a file with autocompletion.
- Getting 2 errors from each package asking to use type import if you didn't.

When an `import` or `export` contains only types, indicate it with the `type` keyword.

```typescript
export type { Direction, DirectionalTrackRange as TrackRange };
```

```typescript
import type { typedEntries, ValueOf } from "utils/types";
```

When an `import` contains not only types, it will be structured like below, in alphabetical order.

```typescript
import {
  osrdEditoastApi,
  type ScenarioCreateForm,
} from "common/api/osrdEditoastApi";
```

This allows to:

- Improve the performance and analysis process of the compiler and the linter.
- Make these declarations more readable; we can clearly see what we are importing.
- Avoid dependency cycles:

![dependency cycle](/images/docs/contribute/dependency-cycle.png)

The error disappears with the `type` keyword

![dependency cycle](/images/docs/contribute/dependency-cycle-gone.png)

- Make final bundle lighter (all types disappear at compilation)
