---
title: "Processus de publication"
linkTitle: "Processus de publication"
weight: 1
description: Voici comment OSRD est actuellement publié
---

OSRD possède trois versions : développement (dev), staging et publication.

La version de développement est la version la plus récente et la plus instable de l'application, contenant les dernières fonctionnalités et corrections de bugs en cours de développement.

Les versions staging sont créées tous les jeudis à 12h en taguant l'état actuel du développement.

Si une version staging passe les tests de validation, elle est promue pour devenir la dernière version publication. Cela garantit que seul du code stable et testé est intégré dans les versions de production.

Le processus de publication suit ce workflow :

1. Développement continu dans la branche dev
2. Tags de staging hebdomadaires les jeudis à 12h
3. Tests de validation de la version staging
4. Promotion des builds staging validés au statut de publication

```ascii
    Développement      Staging                publication
    (instable)         (test)                   (stable)

    [Branche Dev]                                  |
         |                                         |
         |--->     Jeudi 12h                       |
         |         [Tag Staging]                   |
         |                |                        |
         |            Validation                   |
         |              Tests                      |
         |                |                        |
         |                o---> Si Passage -->  Nouvelle
         |                        Tests        publication
    [Suite Dev]                                    |
         |                                         |
         V                                         V
```
