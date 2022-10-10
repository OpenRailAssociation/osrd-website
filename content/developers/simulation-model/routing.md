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
- Une route est dite **commandée** lorsqu'un processus d'activation est en cours, et elle devient **formée** lorsque le processus se termine. Une fois formée, la route passe à l'état **établi**.
- Quand le processus de formation de la route se termine, un processus de destruction démarre. Celui-ci attend l'arrivée du train puis libère les zones après son passage.
- Une route peut être à nouveau formée alors qu'un train est déjà en train de la parcourir, du moment qu'il est possible de réserver les zones dans la bonne configuration. Cela permet à plusieurs trains de se suivre sur la même route.

{{% alert title="Piste d'évolution" color="info" %}}
Certains postes d'aiguillages ont un enclanchement entre itinéraires de sens contraire (affrontement) qui empêche l'activation d'une route en menant à une zone avec un transit en sens contraire. Il serait envisageable de réserver une zone supplémentaire à la fin du chemin protégé par la route, par sécurité.
{{% /alert %}}

{{% alert title="Piste d'évolution" color="info" %}}
Certains itinéraires en gare ne permettent pas le partage du chemin par plusieurs trains, afin d'éviter
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

- **commander une route**: démarre un processus asynchrone qui ne se terminera que lorsque la route aura été formée. **Un processus de destruction doit démarrer dès que la route est formée**.

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

## Pseudocode

```python
@dataclass
class RouteHandle:
    route: Route
    zone_handles: List[ZoneReservationHandle]

    async def release():
        """This method must be awaited on for the route to release reservations behind the train"""
        for release_group in route.release_groups:
            last_zone_index = release_group.last_zone_index
            zone_handle = self.zone_handles[last_zone_index]
            await zone_handle.wait_for_status(train)
            await last_zone.release(train)

class Route:
    async def activate(route, train) -> RouteHandle:
        # zone_sequence is a list of the zones of the route,
        # sorted by any absolute order to avoid deadlocks
        handles = []
        for zone, config in route.zone_reservation_sequence:
            handles.append(await zone.reserve(config, train))

        # open and close the entrance signals
        for zone, _ in route.zones:
            await zone.expect_train(train)
        return RouteHandle(route, handles)
```
