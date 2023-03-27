---
title: "Conventions"
linkTitle: "Conventions"
weight: 40
description: "Conventions de codes et bonnes pratiques"
---

L'application OSRD est divisée en plusieurs services écrits dans plusieurs langues. Nous essayons de suivre les bonnes pratiques générales en matière de code et de respecter les spécificités de chaque langue lorsque cela est nécessaire.

## Règles générales

- Expliquez ce que vous faites et pourquoi.
- Documentez le nouveau code.
- Ajoutez des tests clairs et simples.
- Décomposez le travail en morceaux intelligibles.
- Prenez le temps de choisir de bons noms.
  Évitez les abréviations peu connues.
- **Contrôle et cohérence de la réutilisation du code de tiers** : Ajoutez une dépendance que si elle est absolument nécessaire.
  Chaque dépendance ajoutée diminue notre autonomie et notre cohérence.
- **Ne pas réinventer la roue** : En opposition au point précédent, ne réinventez pas tout à tout prix.
  S'il existe une dépendance dans l'écosystème qui est le standard "de-facto", nous devrions fortement envisager de l'utiliser.
- Plus de code et de recommandations générales dans le dépôt principal [CONTRIBUTING.md](https://github.com/DGEXSolutions/osrd).
- Demandez toute l'aide dont vous avez besoin !

### Python

Le code Python est utilisé pour certains paquets et pour les tests d'intégration.

- Suivez le [Zen of Python](https://www.python.org/dev/peps/pep-0020/).
- Le code est linté avec [flake8](https://github.com/csachs/pyproject-flake8).
- Le code est formaté avec [Black](https://github.com/psf/black).
- Les imports sont triées avec [Isort](https://github.com/PyCQA/isort).
- Les tests sont écrits avec [pytest](https://docs.pytest.org/).

### Rust

- Comme référence pour le développement de notre API, nous utilisons les [Rust API guidelines](https://rust-lang.github.io/api-guidelines/about.html).
  D'une manière générale, il convient de les respecter.
- Préférer les importations granulaires aux importations globales comme `diesel::*`.
- Les tests sont écrits avec le [framework de base](https://doc.rust-lang.org/book/ch11-01-writing-tests.html).
- Utilisez l'[exemple de documentation](https://doc.rust-lang.org/rust-by-example/meta/doc.html) pour savoir comment formuler et formater votre documentation.
- Utilisez un style de commentaire cohérent :
  - `///` les commentaires de la documentation sont au-dessus des invocations `#[derive(Trait)]`.
  - Les commentaires `//` doivent généralement être placés au-dessus de la ligne en question, plutôt qu'en ligne.
  - Les commentaires commencent par des lettres majuscules.
    Terminez-les par un point s'ils ressemblent à une phrase.
- Utilisez les commentaires pour organiser des portions de code longues et complexes qui ne peuvent être raisonnablement remaniées en fonctions distinctes.
- Le code est linté avec [clippy](https://github.com/rust-lang/rust-clippy).
- Le code est formaté avec [fmt](https://github.com/rust-lang/rustfmt).

### Java

- Le code est formaté avec [checkstyle](https://checkstyle.sourceforge.io/).

### Javascript / Typescript / Front

- Lorsque vous ajoutez de nouveaux fichiers, écrivez-les en TypeScript car l'objectif est de passer l'ensemble du code à TypeScript.
- Utiliser les endpoints générés à partir des fichiers `openapi.yaml` pour consommer le backend.
- Le code a été linté avec [eslint] (https://eslint.org/).
- Le code est formaté avec [prettier](https://prettier.io/).
- Des tests de bout en bout sont nécessaires pour les fonctionnalités stables et critiques.
  [Playwright](https://playwright.dev/) est utilisé pour écrire ces tests.
- Pour écrire des tests unitaires, utilisez [vitest](https://vitest.dev/).

### Tests d'intégration

- Les tests d'intégration sont écrits avec [pytest](https://docs.pytest.org/) dans le dossier `/tests`.
- Chaque route décrite dans les fichiers `openapi.yaml` doit avoir un test d'intégration.
- Le test doit vérifier à la fois le format et le contenu des réponses valides et invalides.
