---
title: "Conventions back-end"
linkTitle: "Conventions back-end"
weight: 2
description: "Conventions de codes et bonnes pratiques pour le back-end"
---

# Python

Le code Python est utilisé pour certains paquets et pour les tests d'intégration.

- Suivez le [Zen of Python](https://www.python.org/dev/peps/pep-0020/).
- Les projets sont organisés avec [uv](https://docs.astral.sh/uv/)
- Le code est linté avec [ruff](https://docs.astral.sh/ruff/).
- Le code est formaté avec [ruff](https://docs.astral.sh/ruff/).
- Les tests sont écrits avec [pytest](https://docs.pytest.org/).
- Les types sont vérifiés avec [pyright](https://microsoft.github.io/pyright/).

# Rust

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

# Java

- Le code est formaté avec [checkstyle](https://checkstyle.sourceforge.io/).
