---
title: "Style des commits"
linkTitle: "Style des commits"
weight: 4
description: "Quelques bonnes pratiques et règles pour les messages de commits"
---

Le format général des commits est le suivant :

```
composant1, composant2: description du changement à l'impératif

Description détaillée ou technique du contenu et de la motivation du
changement, si le titre n'est pas complètement évident.
```

- **le message comme le code doit être en anglais** (seulement des caractères ASCII pour le titre)
- il peut y avoir plusieurs composants, séparés par des `:` quand il y a une relation hiérarchique, ou des `,` sinon
- les composants sont en minuscule, avec éventuellement `-`, `_` ou `.`
- la description du changement à l'impératif commence par un verbe en minuscule
- le titre ne doit pas comporter de lien (`#` est interdit)

Idéalement :
- le titre doit être autonome : pas besoin de lire autre chose pour le comprendre
- le titre du commit est entièrement en minuscule
- le titre est clair pour une personne étrangère au code
- le corps du commit contient une description du changement

{{% alert title="" color="info"%}}
Une vérification automatique est effectuée pour vérifier autant que possible ce formatage.
{{% /alert %}}

### Contre-exemples de titres de commit

- `component: update ./some/file.ext` : préciser la mise à jour en question plutôt que le fichier,
  les fichiers sont des éléments techniques bienvenus dans le _corps_ du commit
- `component: fix #42` : préciser le problème corrigé, les liens (vers l'issue, etc.) sont
  encouragés dans le _corps_ du commit
- `wip` : décrire le travail (et le finir)

*[Continuer vers le partage des changements ‣]({{< ref "share-changes">}})*
