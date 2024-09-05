---
title: "Conventions de commits"
linkTitle: "Conventions de commits"
weight: 4
description: "Quelques bonnes pratiques et règles pour les messages de commits"
---

## Style de commits

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

A éviter absolument:

- `component: update ./some/file.ext` : préciser la mise à jour en question plutôt que le fichier,
  les fichiers sont des éléments techniques bienvenus dans le _corps_ du commit
- `component: fix #42` : préciser le problème corrigé, les liens (vers l'issue, etc.) sont
  encouragés dans le _corps_ du commit
- `wip` : décrire le travail (et le finir)

Bienvenus pour faciliter la relecture, mais ne pas merger:

- `fixup! previous commit` : un [autosquash](../share-changes) devra être lancé avant le merge
- `Revert "previous commit of the same PR"` : les deux commits devront être retirés avant merge

## Le Developer Certificate of Origin (DCO)

Tous les projets d'OSRD utilisent le DCO (certificat du développeur d'orgine)
pour des raisons légales. Le DCO permet de confirmer que vous avez les droits
sur le code que vous contribuez. Pour en savoir plus sur l'histoire et
l'objectif du DCO, vous pouvez lire [The Developer Certificate of Origin](https://bssw.io/blog_posts/the-developer-certificate-of-origin)
de Roscoe A. Bartlett.

Pour se conformer au DCO, **tous les commits doivent inclure une ligne
Signed-off-by**.

### Comment signer un commit avec Git dans un terminal ?

Pour signer un commit, il suffit d'ajouter l'option `-s` à votre commande `git
commit`, comme ceci :

```bash
git commit -s -m "Your commit message"
```
Cela s'applique également lors de l'utilisation de la commande `git revert`.

### Comment signer un commit avec Git dans Visual Studio Code (VS Code) ?

Allez dans `Fichiers` -> `Préférences` -> `Paramètres`, puis recherchez et
activez le paramètre **Always Sign Off**.

Ensuite, lorsque vous ferez un commit via l'interface de VS Code, ils seront
automatiquement signés.

*[Continuer vers le partage des changements ‣]({{< ref "share-changes">}})*
