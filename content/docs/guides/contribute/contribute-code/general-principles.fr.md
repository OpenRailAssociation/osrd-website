---
title: "Principes généraux"
linkTitle: "Principes généraux"
weight: 1
description: "À lire en premier !"
---

- Expliquez ce que vous faites et pourquoi.
- Documentez le nouveau code.
- Ajoutez des tests clairs et simples.
- Décomposez le travail en morceaux intelligibles.
- Prenez le temps de choisir de bons noms.
- Évitez les abréviations peu connues.
- **Contrôle et cohérence de la réutilisation du code de tiers** : une dépendance est ajoutée seulement si elle est absolument nécessaire.
- Chaque dépendance ajoutée diminue notre autonomie et notre cohérence.
- Nous essayons de limiter à un petit nombre les PRs de mise à jour des dépendances chaque semaine
dans chaque composant, donc regrouper les montées de version dans une même PR est une bonne option
(reportez-vous au `README.md` de chaque composant).
- **Ne pas réinventer la roue** : en opposition au point précédent, ne réinventez pas tout à tout prix.
- S'il existe une dépendance dans l'écosystème qui est le standard « de facto », nous devrions fortement envisager de l'utiliser.
- Plus de code et de recommandations générales dans le dépôt principal [CONTRIBUTING.md](https://github.com/OpenRailAssociation/osrd/blob/dev/CONTRIBUTING.md).
- Demandez toute l'aide dont vous avez besoin !

*[Consulter les conventions pour le back-end ‣]({{< ref "backend-conventions">}})*

*[Consulter les conventions pour le front-end ‣]({{< ref "frontend-conventions">}})*

*[Continuer vers l'écriture de code ‣]({{< ref "write-code">}})*

*[Continuer vers l'écriture de tests ‣]({{< ref "tests">}})*
