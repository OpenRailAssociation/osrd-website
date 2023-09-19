---
title: "Tests"
linkTitle: "Tests"
description: "Recommandations pour les tests"
---
## Back-end
- Les tests d'intégration sont écrits avec [pytest](https://docs.pytest.org/) dans le dossier `/tests`.
- Chaque route décrite dans les fichiers `openapi.yaml` doit avoir un test d'intégration.
- Le test doit vérifier à la fois le format et le contenu des réponses valides et invalides.

## Front-end
L'écriture fonctionnelle des tests est réalisée avec les *Product Owners*, et les développeurs choisissent une implémentation technique qui répond précisément aux besoins exprimés et qui s'intègre dans les recommandations présentes ici.

Nous utilisons [Playwright](https://playwright.dev/) pour écrire les tests bout en bout, et [vitest](https://vitest.dev/) pour écrire les tests unitaires.

Les navigateurs testés sont pour l'instant [Firefox](https://www.mozilla.org/fr/firefox/switch/) et Chromium.

### Principes de base
- Les tests doivent être **courts** (1min max) et aller **droit au but**.
- Les timeout arbitraires sont proscrits, un test doit systématiquement attendre un évènement spécifique. Il est possible d'utiliser le *polling* (retenter une action — un clic par exemple — au bout d'un certain temps) proposé dans l'API de [Playwright](https://playwright.dev/).
- Les tests doivent tous pouvoir être parallélisables.
- Les tests ne doivent pas pointer/attendre des éléments de texte issus de la traduction, préférer l'arborescence du *DOM* ou encore placer des `id` spécifiques.
- On ne teste pas les données mais l'application et ses fonctionnalités. Des tests spécifiques aux données sont à élaborer par ailleurs.

#### Données
**Les données testées doivent impérativement être des données publiques.**
Les données nécessaires (infrastructure et matériel) aux tests sont proposées dans des fichiers `json` de l'application, *injectées* au début de chaque test et effacées à la fin peu importe son résultat ou la manière d'être stoppé, y compris par `CTRL+C`.

Cela se fait par des appels API en typescript avant de lancer le test à proprement parler.

Les données testées sont les mêmes en local ou via l'intégration continue.

#### Atomicité d'un test
Chaque test doit être **atomique** : il se suffit à lui même et ne peut pas être divisé.

Un test va cibler une fonctionnalité ou un composant, si ce dernier n'est pas trop gros. Un test ne testera pas tout un module ou tout une application, ce sera forcément un ensemble de tests afin de préserver l'atomicité des tests.

Si un test a besoin que des éléments soient créés ou ajoutés, ces opérations doivent être opérées par des appels API en typescript en amont du test, à l'instar de ce qui est fait pour l'ajout de données. Ces éléments doivent être supprimés à l'issue du test, peu importe son résultat ou la manière d'être stoppé, y compris par `CTRL+C`.

Cela permettra notamment la parallélisation des tests.

Un test peut cependant, dans certains cas de figure où cela est pertinent, contenir plusieurs sous-divisions de test, clairement explicitées, et justifiées (plusieurs `test()` dans un seul `describe()`).

### Exemple de test
Le besoin : « nous voulons tester l'ajout d'un train dans une grille horaire ».

1. ajouter l'infrastructure et le matériel roulant de test dans la base de données **par appels API**
2. créer projet, étude et scénario avec choix de l'infra de test **par appels API**
3. début du test qui clique sur « ajouter un ou plusieurs trains » jusqu'à la vérification de la présence des trains dans la grille horaire
4. le test a réussi, a échoué, ou est stoppé, le projet, l'étude et le scénario sont effacés, ainsi que le matériel roulant et et l'infrastructure de test **par appels API**

*NB : le test ne va pas tester toutes les possibilités offertes par l'ajout de trains, cela relève d'un test spécifique qui testerait la réponse de l'interface pour tous les cas de figure sans ajouter de trains.*
