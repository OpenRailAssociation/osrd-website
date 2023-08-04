---
title: "Front-end"
linkTitle: "Front-end"
description: "Coding style guide and best practices for front-end"
---

Nous utilisons **ReactJS** et tous les fichiers doivent être écrits en **Typescript**.

Le code est **linté** avec [eslint](https://eslint.org/), et **formaté** avec [prettier](https://prettier.io/).

## Nomenclature

![Diagramme de l'Infrastructure](../nomenclature-front-end.svg)

Les **applications** (osrd eex, osrd stdcm, éditeur infra, éditeur matériel) proposent des **vues** (gestion des projets, gestions des études, etc.) liées à des **modules** (projet, étude, etc.) qui contiennent les composants.

Ces **vues** sont constituées de **composants** et sous-composants <u>tous issus des modules</u>.
En plus de contenir les fichiers de **vues** des applications, elles peuvent contenir un répertoire **scripts** qui propose des scripts liés à ces vues. Les **vues** déterminent la logique et l'<u>accès au store</u>.

Les **modules** sont des collections de **composants** rattachés à un **objet** (un scénario, un matériel roulant, un TrainSchedule). Ils contiennent :
  - un répertoire *components* qui héberge <u>tous</u> les composants
  - un répertoire *styles* optionnel <u>par module</u> pour le style des composants en scss
  - un répertoire *assets* optionnel <u>par module</u> (qui contient les assets, de jeux de données par défaut par ex, spécifiques au module)
  - un fichier *reducers* optionnel <u>par module</u>
  - un fichier *types* optionnel <u>par module</u>
  - un fichier *consts* optionnel <u>par module</u>

Un répertoire **assets** (qui contient les images et autre fichiers).

Enfin, un répertoire **common** qui propose :
  - un répertoire *utils* pour les fonctions utilitaires communes à l'ensemble du projet
  - un fichier *types* pour les types communs à l'ensemble du projet
  - un fichier *consts* pour les constantes communes à l'ensemble du projet


## Principes d'implémentation
### Routage & SLUG
_Rédaction en cours_

`projects/{nom du projet}/studies/{nom de l'étude}/scenarios/{nom du scenario}`

### Styles & SCSS
_Rédaction en cours_

### Store/Redux
Tout ce qui est *selector* est géré par la **vue** passé en props aux composants et sous-composants.

Par conséquent les appels au store en lecture et en écriture doivent être passés un niveau de la vue, en irrigant par des _props_ et _states_ les composants proposées par la vue.

### RTK
_Rédaction en cours_

Utiliser les endpoints générés à partir des fichiers `openapi.yaml` pour consommer le backend.


## Lois et éléments importants

> **Aucun composant ne doit détenir la responsabilité de mise à jour de la donnée qu'il utilise**
>
> Seules <u>les vues</u> contiennent les sélecteurs du store, donnés ensuite en props aux composants du module lié à la vue.

> **Le SCSS n'est pas scopé**
>
> Un fichier `.scss` enfoui dans l'arborescence ne vous garantit pas que les classes contenues soient seulement accessibles à cet endroit, y compris par import react (formellement interdit au passage : vous devez utiliser l'import SCSS), toutes les classes déclarées sont accessibles partout.
>
> Préférez un choix judicieux de nom de classe racine pour un module donné et utilisez l'arborescence possible dans le fichier SCSS.

> **Les liens des imports doivent être absolus**
>
> Vous devez utiliser le <u>chemin complet</u> pour tous vos imports, sans exception, même si le fichier à importer se trouve dans le même répertoire.
