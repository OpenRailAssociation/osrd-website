---
title: "Reservation"
linkTitle: "Reservation"
weight: 30
description: "Gère l'état de réservation des zones"
---

## Description

Ce sous-système a la responsabilité de 

Les zones (ou TVDSection / DetectionSection) sont des partitions physiques des voies:

 - capables de détecter la présence d'un train
 - qui fournissent un service de réservation à l'usage des routes

Chaque zone a un certain nombre de configurations différentes.
Par exemple, une zone sans aiguille aura deux configurations:

 - sens pair
 - sens impair

Une zone avec une aiguille aura 4 configurations:

 - sens pair voie principale
 - sens impair voie principale
 - sens pair voie déviation
 - sens impair voie déviation

**Chaque zone ne peut être réservée que pour une configuration donnée à la fois, mais peut être réservée simultanément par plusieurs routes**.
Une zone ne peut changer de configuration que lorsqu'elle n'est pas réservée.

L'enclanchement de transit est un enclanchement qui vise à empêcher le mouvement d'un appareil de voie lorsqu'un train est en approche.
Il concerne les organes de commandes des aiguilles.
un enclanchement est un système qui permet d'imposer des ordres de manoeuvre sur un système, soit imposer des interdictions


## État

```rust
struct ZoneState {
  reservation: ZoneReservationState,
  occupation: usize,
}

enum ZoneReservationState {
  Free,
  Reserved(config: ZoneConfig, count: usize),
}
```

## Dépendances

 - une liste de zones
 - capacité d'observer l'occupation des zones
 - capacité d'actionner les éléments mobiles

## Opérations

 - Observer les changements d'état d'une zone
 - Réserver une configuration de zone
 - Relacher une réservation de zone


