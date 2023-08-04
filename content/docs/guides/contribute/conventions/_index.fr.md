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
- Plus de code et de recommandations générales dans le dépôt principal [CONTRIBUTING.md](https://github.com/osrd-project/osrd).
- Demandez toute l'aide dont vous avez besoin !
