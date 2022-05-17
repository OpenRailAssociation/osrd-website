---
title: "Routage"
linkTitle: "Routage"
weight: 40
description: "Gère le cycle de vie des itinéraires"
---

## Description

- Les routes sont formées à la demande. Plusieurs demandes peuvent avoir cours en simultané. Il est de la responsabilité du composant qui active les routes de s'assurer que les demandes sont faites dans le bon ordre.
- Une route est dite commandée lorsqu'un processus d'activation est en cours, et elle devient formée lorsque le processus se termine
- Une route peut être activée alors qu'un train est déjà en train de la parcourir. Il faut seulement qu'il soit possible de réserver les zones dans la bonne configuration.

{{% alert color="info" %}}
certains postes d'aiguillages ont un enclanchement entre itinéraires de sens contraire (affrontement) qui empêche l'activation d'une route en menant à une zone avec un transit en sens contraire.
{{% /alert %}}

## Exigences de conception

- Le système doit permettre à la **signalisation** de déterminer si la route est **prête à être empruntée**.
- Le système doit permettre l'**ordonnancement** des trains selon des critères configurables.
- Le système doit optionnellement permettre la destruction progressive (**transit souple**) de l'itinéraire après le passage du train. 
- Commande simultanée de l'itinéraire

## Possibilités de design

La contrainte la plus importante est la réaction des signaux aux itinéraires devant eux. Traditionnellement, les signaux réagissent à la complète formation d'une des routes devant eux. Cette formulation, si elle est sûre, impose plusieurs contraintes:
- Il est nécessaire d'associer un état à chaque itinéraire.
- Les signaux doivent aggréger l'état de tous les itinéraires devant eux. Il peut y en avoir beaucoup.

Une autre possibilité est d'insérer un objet intermédiaire entre le signal et les routes devant lui, qui serait explicitement notifié par le processus d'activation de l'itinéraire de son état. Il existerait un objet de ce genre par couple `(détecteur, direction)` d'où une route part.

La seconde option nous semble préférable, car elle permet d'avoir un couplage moins fort entre la signalisation et les itinéraires.


## Dépendances

- une liste d'élements mobiles
- liste des états possibles de chaque élément mobile

## Opérations

- **activer une route**: démarre un processus asynchrone qui ne se terminera que lorsque la route aura été réservée. Un objet permettant d'attendre que la route soit détruite après le passage du train est retourné
- **observer un point d'entrée d'itinéraire** permet à la signalisation de protéger les appareils de voie

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
        route.entry_trigger.open()
        await route.zones[0].wait_until_train_leaves()
        route.entry_trigger.close()
    
        return RouteHandle(route, handles)
```
