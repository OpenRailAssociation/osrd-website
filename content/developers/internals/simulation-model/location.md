---
title: "Localisation"
linkTitle: "Localisation"
weight: 20
description: "Fournit les informations de position des trains sur le réseau"
---

## Description

La couche de localisation permet à d'autres modules de simulation de suivre le déplacement du train dans l'infrastructure.
L'infrastructure ferroviaire est découpée en régions appelées zones. Quand on train entre dans une zone, ce module permet d'en être notifié.

Les zones (ou TVDSection / DetectionSection) sont des partitions physiques des voies :

- capables de détecter la présence d'un train

## Exigences de conception

- il doit être possible de suivre les changements d'occupation d'une zone
- il _devra_ être possible de suivre les déplacements d'un train
- il _devra_ être possible d'implémenter un système de bloc mobile

## Dépendances

- `statique` une liste de zones

## Opérations

- Occuper une zone
- Libérer une zone
- Observer les changements d'occupation d'une zone
