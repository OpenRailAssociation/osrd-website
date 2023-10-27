---
title: "Mise à jour groupée des dépendances"
linkTitle: "Mise à jour groupée des dépendances"
weight: 20
description: ""
---


## Pour editoast

Nous utilisons dependabot sur le projet pour signaler quand les dépendances sont obsolètes. Nous ne nous en servons pas pour mettre à jour automatiquement les dépendances, pour intégrer toutes les mises à jour en une seule fois et relire les modifications.

Pour mettre à jour les dépendances :

1. Changez les versions.
    * *Si vous utilisez VSCode* vous pouvez installer l'extension `crates` et exécuter la commande "update all dependencies".  
    Cela mettra à jour toutes les dépendances vers leur dernière version, et écrasera les contraintes de version trop larges.  
    Assurez-vous que la nouvelle version choisie est stable, et que les contraintes volontairement larges ne sont pas écrasées par votre commit.
    * *Sinon* vous pouvez vérifier les versions utilisées par dependabot dans [ses PRs](https://github.com/osrd-project/osrd/lls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) et mettre à jour les versions manuellement.
2. Exécutez `cargo update` pour mettre à jour le fichier Cargo.lock (y compris les sous-dépendances).
3. Vérifiez que tous les [PRs dependabot editoast](https://github.com/osrd-project/osrd/lls?q=is%3Aopen+label%3Aarea%3Aeditoast+label%3Adependencies) sont inclus dans votre commit.
4. Adaptez le code aux nouvelles versions, si nécessaire.
5. Créez un PR avec vos modifications, et reliez-y tous les PRs dependabot en description.