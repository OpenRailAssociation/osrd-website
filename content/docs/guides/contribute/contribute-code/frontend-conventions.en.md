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

### Naming

The following conventions are generally used in the code:
- components and types are in PascalCase
- variables are in camelCase
- translation keys are also in camelCase
- constants are in SCREAMING_SNAKE_CASE (except in special cases)
- CSS classes are in kebab-case

### Styles & SCSS

> WARNING: in CSS/React, the scope of a class does not depend on where the file is imported, but is valid for the entire application. If you import an `scss` file in the depths of a component (which we strongly advise against), its classes will be available to the whole application and may therefore cause side effects.

It is therefore highly recommended to be able to easily follow the tree structure of applications, views, modules and components also within the SCSS code, and in particular to nest class names to avoid edge effects.

Some additional conventions:
- All sizes are expressed in px, except for fonts which are expressed in rem.
- We use the [classnames library](https://github.com/JedWatson/classnames) to conditionally apply classes: each class is separated into a string, and Boolean or other operations are performed in an object that will return—or not—the property name as the class name to be used in CSS.


### Store/Redux

The store allows you to store data that will be accessible anywhere in the application. It is divided into slices, which correspond to our applications.

However, we must be careful that our store does not become a catch-all.
Adding new properties to the store must be justified by the fact that the data in question is “high-level” and will need to be accessible from locations far from each other, and that a simple state or context variable is not appropriate for storing this information.

For more details about redux, please refer to the [official documentation](https://redux.js.org/).

### Redux ToolKit (RTK)

We use [Redux ToolKit](https://redux-toolkit.js.org/) to make our calls to the backend.

RTK allows you to make API calls and cache responses. For more details, please refer to the [official documentation](https://redux-toolkit.js.org/rtk-query/overview).

The backend endpoints and types are generated directly from the editoast open API and stored in `generatedOsrdApi` (using the `npm run generate-types` command). This generated file is then enriched with other endpoints or types in `osrdEditoastApi`, which can be used in the application. Note that it is possible to transform mutations into queries when generating `generatedOsrdApi` by modifying the `openapi-editoast-config` file.

When an endpoint call must be skipped because a variable is not defined, RTK's [skipToken](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#skipping-queries-with-typescript-using-skiptoken) is used to avoid having to use casts.


### Translation

Application translation is performed on [Weblate](https://hosted.weblate.org/projects/osrd/).


### Imports

It is recommended that you use the full path for each import, unless your import file is in the same directory.

ESLint is setup to automatically sort imports in four import groups, each of them separated by an empty line and sorted in alphabetical order :

- React
- External libraries
- Internal absolute path files
- Internal relative path files


Regarding type imports/exports, ESLint and Typescript are configured to automatically add `type` before a type import, which allows to:
- Improve the performance and analysis process of the compiler and the linter.
- Make these declarations more readable; we can clearly see what we are importing.
- Make final bundle lighter (all types disappear at compilation)
- Avoid dependency cycles (ex: the error disappears with the `type` keyword)
  ![dependency cycle](/images/docs/contribute/dependency-cycle.png) ![dependency cycle](/images/docs/contribute/dependency-cycle-gone.png)

