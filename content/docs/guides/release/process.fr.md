---
title: "Processus de publication"
linkTitle: "Processus de publication"
weight: 1
description: Voici comment OSRD est actuellement publié
---

OSRD possède trois versions : développement (dev), staging et publication.

La version de développement est la version la plus récente et la plus instable de l'application, contenant les dernières fonctionnalités et corrections de bugs en cours de développement.

## Processus courant

Les versions staging sont créées tous les jeudis à 12h en taguant l'état actuel du développement.

Si une version staging passe les tests de validation, elle est promue pour devenir la dernière version publication. Cela garantit que seul du code stable et testé est intégré dans les versions de production.

Le processus de publication suit ce workflow :

1. Développement continu dans la branche `dev`
2. Tags de `staging` hebdomadaires les jeudis à 12h
3. Tests de validation de la version `staging`
4. Promotion des builds `staging` validés au statut de publication

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

## Iteration de stabilisation et d'innovation

Toutes les 11 semaines, une itération (2 semaines) est consacrée à la stabilisation et l'innovation.

Le but est de s'assurer de publier une version stable à cette échéance (accent mis sur la détection et correction de bugs).

Le processus de travail durant cette période est le suivant :

* La branche `dev` conserve sa vie courante (afin d'éviter de bloquer les travaux ou de créer des conflits supplémentaires)
* Un focus particulier est effectué sur la correction de bug avec le processus suivant :
  1. Une PR de correction est ouverte puis mergée sur la `dev`
  2. Puis une nouvelle PR est ouverte pour reporter la correction sur la branche `staging`

Un rapport de bug requiert donc 2 PRs pour être clos.
Ce processus est maintenu pendant 2 semaines (même si les tests de validations sont corrects dès la première semaine).
