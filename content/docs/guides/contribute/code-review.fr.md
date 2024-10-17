---
title: "Revue de code"
linkTitle: "Revue de code"
description: "Comment faire des retours constructifs"
weight: 4
---

Le reviewer/mainteneur s'engage à effectuer la revue de code rapidement, c'est aussi à lui qu'appartient de fermer les « _request changes_ », de bien vérifier l'historique des commits, et de fusionner la « _pull request_ » s'il en a les droits.

Nous vous soumettons quelques conseils et recommandations qui nous semblent pertinentes pour une revue de code humaine, pertinente et enrichissante pour tous ses contributeurs :
- [How to Make Your Code Reviewer Fall in Love with You?](https://mtlynch.io/code-review-love/) par Michael Lynch.
- [How to Do Code Reviews Like a Human? ](https://mtlynch.io/human-code-reviews-1/) par Michael Lynch.

{{% include "./review-process.fr.md" %}}

## La pyramide de la revue de code

{{< figure src="/images/docs/contribute/code_review_pyramid.svg" link="https://www.morling.dev/blog/the-code-review-pyramid/">}}

## Script pour le test d'une PR

Lors de la revue d'une PR, il est utile de tester les changements en démarrant une instance de l'application OSRD basée sur la branche de la PR.

Un script est disponible pour lancer automatiquement une instance séparée et dédiée de l'application en utilisant le numéro de la PR. Le script utilise les images Docker déjà construites par la CI et lance l'application de manière isolée. Cela permet d'exécuter les deux instances en parallèle, sans conflits (idéal pour comparer les modifications, par exemple).

De plus, vous pouvez fournir une sauvegarde de la base de données, que le script chargera directement dans l'application.

L'application sera lancée sur le port 4001. Vous pouvez y accéder en suivant : http://localhost:4001/

### Commandes Disponibles :

* `./scripts/pr-tests-compose.sh 8914 up` : Télécharge les images CI générées pour la PR #8914 et lance l'application.
* `./scripts/pr-tests-compose.sh 8914 up-and-load-backup ./path_to_backup` : Télécharge les images pour la PR #8914, restaure les données à partir de la sauvegarde spécifiée, et démarre l'application.
* `./scripts/pr-tests-compose.sh down` : Arrête l'instance de test de l'application pour la PR #8914.
* `./scripts/pr-tests-compose.sh down-and-clean` : Arrête l'instance de test et nettoie l'ensemble des volumes docker de l'instance (base de donnée PG, cache Redis, RabbitMQ) pour éviter tout effet de bord.


### Accès aux Services :

À l'exception du serveur frontend, tous les services sont disponibles sur localhost, avec un léger ajustement de port (pour éviter les conflits avec l'environnement de développement) : pour la liste des ports, reportez-vous au [fichier docker compose dédié](https://github.com/OpenRailAssociation/osrd/blob/dev/docker/docker-compose.pr-test.yml).
