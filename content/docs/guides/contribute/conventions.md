---
title: "Conventions de style"
linkTitle: "Conventions de style"
weight: 90
description: Conventions de style communes
---

Les conventions de style sont des règles d'écriture qui permettent d'uniformiser divers aspects du projet.

Elles sont relativement importantes, car elles permettent une meilleure compréhension entre développeurs, et donc une productivité accrue.


## Style des commits

Le format général des commits est le suivant :

```
composant: description du changement à l'impératif

Description détaillée du contenu et de la motivation du changement,
si le titre n'est pas complètement évident.
```

- **le message comme le code doit être en anglais**
- tout en minuscule
- il peut y avoir plusieurs composants, séparés par des `:` quand il y a une relation hiérarchique, ou des `,` sinon
- dans l'idéal, le corps du commit contient une description du changement.
