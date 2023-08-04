---
title: "Tests"
linkTitle: "Tests"
description: "Recommandations pour les tests"
---

# Test d'intégration

- Les tests d'intégration sont écrits avec [pytest](https://docs.pytest.org/) dans le dossier `/tests`.
- Chaque route décrite dans les fichiers `openapi.yaml` doit avoir un test d'intégration.
- Le test doit vérifier à la fois le format et le contenu des réponses valides et invalides.

## Front-end
- Des tests de bout en bout sont nécessaires pour les fonctionnalités stables et critiques.
  [Playwright](https://playwright.dev/) est utilisé pour écrire ces tests.
- Pour écrire des tests unitaires, utilisez [vitest](https://vitest.dev/).
