---
title: "Reservation"
linkTitle: "Reservation"
weight: 30
description: "Gère l'état de réservation des zones"
---

## Description

Les zones (ou TVDSection / DetectionSection) sont des partitions physiques des voies :

- capables de détecter la présence d'un train
- qui fournissent un service de réservation à l'usage des routes

Chaque zone a un certain nombre de configurations différentes.
Par exemple, une zone sans aiguille aura deux configurations :

- sens pair
- sens impair

Une zone avec une aiguille aura 4 configurations :

- sens pair voie principale
- sens impair voie principale
- sens pair voie déviation
- sens impair voie déviation

**Chaque zone ne peut être réservée que pour une configuration donnée à la fois, mais peut être réservée simultanément par plusieurs routes**.
Une zone ne peut changer de configuration que lorsqu'elle n'est pas réservée.

L'enclanchement de transit est un enclanchement qui vise à empêcher le mouvement d'un appareil de voie lorsqu'un train est en approche.
Il concerne les organes de commandes des aiguilles.
un enclanchement est un système qui permet d'imposer des ordres de manoeuvre sur un système, soit imposer des interdictions

## Exigences de conception

- Les zones doivent pouvoir être **vérouillées** dans une configuration particulière.
- Il doit être possible pour plusieurs routes de **partager une réservation** de configuration.
- Il doit être possible d'observer l'**évolution de statut d'une réservation**.

## État

```python
class ZoneReservationStatus(IntEnum):
    # the head of the train didn't yet enter the zone
    AWAITING_USE = auto()
    # the train is inside the zone
    IN_USE = auto() 
    # the train went and left
    AWAITING_RELEASE = auto()


class ZoneReservation:
    train: TrainHandle
    status: ZoneReservationStatus

    async def wait_for_status(self, status):
        raise NotImplemented

    async def release(self):
        raise NotImplemented
    

class ZoneState:
    # the current layout of the zone
    configuration: ZoneConfiguration
    # the list of trains which hold a right to use the zone in its current configuration
    reservations: Set[TrainHandle]
    # the list of trains currently inside the zone
    occupation: Set[TrainHandle]

    @property
    def is_locked(self):
        """When any train holds a reservation for a route, the zone cannot change configuration"""
        return len(self.reservations) != 0

    @abstractmethod
    async def reserve(self, configuration) -> ZoneReservation:
        raise NotImplemented
```

## Dépendances

- une liste de zones
- capacité d'observer l'occupation des zones
- capacité d'actionner les éléments mobiles

## Opérations

- **cantonnement**: Observer l'occupation de la zone
- **cantonnement**: Observer la configuration de la zone (?)
- **routage**: Réserver une configuration de zone
- **routage**: Attendre que la réservation de la zone soit utilisée par son train
- **routage**: Relacher une réservation de zone
