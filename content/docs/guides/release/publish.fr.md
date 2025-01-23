---
title: "Publier une nouvelle version"
linkTitle: "Publier une nouvelle version"
weight: 2
description: Comment publier une nouvelle version
---

Toutes les versions d'OSRD sont accessibles [ici](https://github.com/OpenRailAssociation/osrd/releases)

Le processus de création d'une nouvelle version est le suivant :

1. Nous publions toujours sur une version testée de l'application (branche staging)
    - `git switch staging && git pull`
1. Créer un tag git **annoté**
    - Nous utilisons le [versionnage sémantique](https://semver.org/)
    - `git tag -a vx.y.z` avec le message `Release x.y.z` (la plupart du temps, utilisez la dernière version et incrémentez la version patch)
    - `git push --tags`
1. Créer une release GitHub
    - Créer une nouvelle release GitHub [ici](https://github.com/OpenRailAssociation/osrd/releases/new)
    - Sélectionner le tag créé
    - Générer les notes de version
    - Renommer la release ainsi : "Version x.y.z"
    - Cocher la case "Set as a pre-release"
    - Appliquer le [format du changelog]({{< relref "#Format du changelog" >}})
    - Vous pouvez ensuite **publier** la release ou **sauvegarder** le brouillon si vous souhaitez y revenir plus tard
1. Une [action GitHub](https://github.com/OpenRailAssociation/osrd/actions/workflows/release.yml) devrait être déclenchée automatiquement.
1. Poster le lien de la release créée sur Matrix. Suggérer aux développeurs de revoir la release.

### Format du changelog

1. Utiliser la structure suivante :

```md
## What's Changed

### Features :tada:


### Code refactoring :recycle:


### Bug fixes :bug:


## New Contributors

<!-- Copy from the generated release notes -->
...

<!-- Copy from the generated release notes -->
**Full Changelog**: ...
```

2. Répartir les différentes pull requests
3. Fusionner ou regrouper les PR quand cela a du sens. Exemples :
    - PR de mise à jour des dépendances (fusionner)
    - PR en plusieurs parties (fusionner)
    - Une grande fonctionnalité implémentée par plusieurs PR (regrouper)
4. Reformuler les titres des PR. **Ils doivent être compréhensibles pour un collaborateur externe**
