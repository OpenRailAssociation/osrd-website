---
title: "Services"
linkTitle: "Services"
weight: 43
description: Architecture des services de l'application
---

Il s’agit d’une architecture multi-services où plusieurs composants logiciels interagissent entre eux. Ce choix a été fait pour assurer la modularité du code et pour garantir l’exploitabilité de certains services d’OSRD par des applications extérieures.


## Actuel 

![Schéma des services du projet](services.fr.svg)

## Cible 

De nombreuses choses sont prévues dans le futur, notamment

- [X] Ajouter un reverse proxy authentifiant (gateway)
- [X] Déployer `editoast` en tant que service de tuiles cartographiques "scalable" horizontalement
- [ ] Rendre le service `core` "scalable" horizontalement
  - Les services de base ne gèreront qu'une seule infrastructure (sur une version donnée) à la fois
  - Ajouter un service RabbitMQ pour distribuer les requêtes à la bonne instance de core
  - Créer un service `core-controller` qui créera / tuera / mettra à l'échelle les services `core` (avec le support de k8s et docker)
  - La responsabilité du chargement des infrastructures est déplacée du front vers le `core-controler`.

![Schéma des services du projet](services_target.fr.svg)
