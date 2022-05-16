---
title: "Signalisation"
linkTitle: "Signalisation"
weight: 60
description: "Gère l'état des signaux"
---


## Description

La couche de signalisation comprend l'ensemble des signaux, qui réagissent au cantonnement et à la réservation.
Les signaux peuvent être de différent types, et sont chargés de manière modulaire. Seul importe leur comportement
vis-à-vis de l'état de l'infrastructure, et la réaction des trains à la signalisation.

## État

Chaque système de signalisation a son type d'état de signal.

Étant donné un type de signal, il doit être possible de :

- savoir s'il est contraignant
- déterminer une représentation graphique de ce signal
- **TODO**: il devra être possible de faire réagit un train à ce signal

## Dépendances

- capacité d'observer l'état des routes, pour les signaux qui débutent une route
- possibilité d'observer l'état des cantons devant le signal, de sélectionner le canton actif, et de réagir en fonction de l'occupation du canton et du signal de fin de canton

## Opérations

- **observer le signal**
