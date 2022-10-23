---
title: "Routage"
linkTitle: "Routage"
weight: 40
description: "Gère le cycle des routes"
---

## Description

- Les routes ont pour responsabilité d'autoriser le déplacement des trains dans l'infrastructure. Elles doivent se terminer à un point où l'arrêt du train est prévu (en terme de signalisation, pas voyageur).
- Les routes sont assimilables à des itinéraires, ou à des suites d'itinéraires et d'installations de pleine voie.
- Les routes n'ont pas de lien direct avec le cantonnement et la signalisation. Elles nourissent des informations sur la disponibilité des voies qui sont utilisées par le cantonnement et la signalisation.
- Une route est un chemin de détecteur en détecteur. Elle représente une portion de chemin qu'il est sûr pour un train d'emprunter.
- Les routes ont des points de libération, qui sont des détecteurs qui délimitent quand détruire l'itinéraire, ce qui permet d'implémenter transit souple, rigide, et entre-deux.
- Une route peut être à nouveau formée alors qu'un train est déjà en train de la parcourir. Cela permet à plusieurs trains de se suivre sur la même route.

### Cycle de vie d'une route

Les routes n'ont pas d'état, mais leur commande donne lieu à une suite d'événements systématique :

- le système commande toutes les routes sur le trajet du train dans l'ordre, sans attendre
  - la commande doit être acceptée par le **régulateur**
- lorsque le régulateur accepte la commande, la **formation** commence
  - le droit d'action de chaque zone de la route est acquis, selon un ordre global
  - en parallèle pour toutes les zones:
    - si la zone n’est pas dans la configuration souhaitée:
      - si elle est déjà réservée, attendre que les réservations expirent
      - sinon, la mettre dans la configuration souhaitée en déplaçant les aiguilles
    - pré-réserver la zone pour le passage du train
    - le droit d'action de la zone est cédé
- une fois que la formation est terminée, la route est **établie**
  - pour chaque zone, transformer la pré-réservation du train en réservation
- dès que la route est établie, un processus de **destruction de la route** commence
  - pour chaque zone de la route donnant lieu à une libération
    - attendre que le train quitte la zone (que la réservation passe de l'état `OCCUPIED` à l'état `PENDING_RELEASE`)
    - libérer la réservation des zones du début de la route jusqu'à la zone actuelle

{{% alert title="Piste d'évolution" color="info" %}}
Certains postes d'aiguillages ont un enclenchement entre itinéraires de sens contraire (affrontement) qui empêche l'activation d'une route en menant à une zone avec un transit en sens contraire. Il serait envisageable de réserver une zone supplémentaire à la fin du chemin protégé par la route, par sécurité.
{{% /alert %}}

{{% alert title="Piste d'évolution" color="info" %}}
Certains itinéraires en gare ne permettent pas le partage du chemin par plusieurs trains
{{% /alert %}}

{{% alert title="Piste d'évolution" color="info" %}}
En pratique, il pourrait être intéressant d'introduire une notion de route partielle afin de réduire le nombre de routes nécessaires: une route partielle est une portion de route qu'il n'est pas sûr d'activer indépendament.
{{% /alert %}}

## Exigences de conception

Le système doit, indirectement ou directement:

- permettre à la **signalisation** de déterminer si une section de voie est **prête à être empruntée**.
- permettre l'**ordonnancement** des trains selon des critères configurables.
- permettre la destruction progressive (**transit souple**) de l'itinéraire après le passage du train.
- il doit être possible d'avoir plusieurs processus de commande actifs au même moment pour la même route, afin de supporter des trains qui se suivent

## Dépendances

- une liste d'élements mobiles
- liste des états possibles de chaque élément mobile

## Opérations

- **commander une route**: démarre un processus asynchrone qui ne se terminera que lorsque la route aura été établie. **Un processus de destruction doit démarrer dès que la route est établie**.

## Notes de conception

Ces notes permettent d'expliquer les décisions qui ont été prises, afin de pouvoir plus aisément les comprendre et évoluer.

### Informer la signalisation

Sachant que:
- il peut y avoir beaucoup de zones partant d'un même point, il est préférable d'éviter de contraindre les signaux à observer une liste de routes
- il est potentiellement difficile d'associer un état clair à chaque route

Il en ressort plusieurs manières d'informer la signalisation de la navigabilité des voies:
- soit **directement**, en faisant observer à la signalisation les points d'entrée des routes. Si plusieurs routes partent du même endroit, elles partageraient un objet entrée:
  - moins de complexité dans la couche de réservation, plus de complexité dans la couche de routage
- soit **indirectement**, via la couche de réservation des zones, qui auraient un état supplémentaire pour marquer leur navigabilité:
  - moins de complexité dans la couche de routage, plus de complexité dans la couche de réservation
  - `avantage` le processus d'activation des routes n'aurait pas besoin d'attendre l'arrivée du train, la couche de réservation s'en occuperait.
  - `avantage` découplage entre routage et cantonnement / signalisation.

La seconde option a été choisie, car:
 - elle permet d'avoir un couplage moins fort entre la signalisation et les routes.
 - elle évite aussi au processus d'activation des routes d'attendre le passage du train alors que la couche de réservation le fait déjà.

### Cycle de vie des routes et état des zones

Plusieurs enjeux motivent le cycle de vie des routes et l'état des zones :
 - d'une part, l'état des zones est au coeur de la détection de conflit : il doit être possible d'extraire d'une simulation d'un train seul ses besoins en ressources
 - d'autre part, il faut qu'une simulation multi-train fonctionne correctement : le temps de déplacement des aiguilles selon la configuration actuellement en place, en particulier, est un point de friction important
