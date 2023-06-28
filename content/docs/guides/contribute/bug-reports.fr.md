---
title: "Signaler des problèmes"
linkTitle: "Signaler des problèmes"
weight: 20
description: "Comment signaler un bug ou suggérer une amélioration"
---

**N'hésitez pas à signaler tout ce qui vous semble important !**

Notre outil de suivi des bugs est [github](https://github.com/osrd-project/osrd/issues). Il est nécessaire de s'inscrire pour signaler un bug.

Suivez [ce lien](https://github.com/osrd-project/osrd/issues/new/choose) et choisissez le modèle qui correspond à votre cas de figure.

### Bugs

- Le bug doit avoir une description correcte et le modèle du bug doit être rempli avec soin.
- Le bug doit être étiqueté avec (_pour les membres de l'équipe_) :
  - `kind:bug`
  - une ou plusieurs `area:<affected_area>` si possible (si la zone affectée n'est pas connue, laissez-la vide et elle sera ajoutée plus tard par un autre membre de l'équipe).
  - un `severity:<bug_severity>` si possible (si la sévérité n'est pas connue, laissez-la vide et elle sera ajoutée plus tard par un autre membre de l'équipe).
    - `severity:minor` : L'utilisateur peut encore utiliser la fonctionnalité.
    - `severity:major` : L'utilisateur ne peut parfois pas utiliser la fonctionnalité.
    - `severity:critical` : L'utilisateur ne peut pas utiliser la fonctionnalité.
- Les membres de l'équipe OSRD peuvent modifier les étiquettes des problèmes (gravité, domaine, type, ...).
  Vous pouvez laisser un commentaire pour expliquer les changements.
- Si vous travaillez sur un bug ou planifiez de travailler sur un bug, assignez vous au bug.
- Les PRs qui résolvent des bugs doivent ajouter des tests de régression pour s'assurer que le bug ne reviendra pas dans le futur.
