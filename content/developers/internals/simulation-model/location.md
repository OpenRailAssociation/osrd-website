---
title: "Localisation"
linkTitle: "Localisation"
weight: 20
description: "Fournit les informations de position des trains sur le réseau"
---

## Description

La couche de localisation suit le déplacement des trains dans l'infrastructure

## Dépendances

- une liste de zones

## Opérations

- Occuper une zone
- Libérer une zone
- Observer les changements d'occupation d'une zone

## Exigences de conception

- il doit être possible de suivre les changements d'occupation d'une zone
- il _devra_ être possible de suivre les déplacements d'un train
- il _devra_ être possible d'implémenter un système de bloc mobile