---
title: "Train"
linkTitle: "Train"
weight: 70
description: "Représente un train dans la simulation"
---

## Description

Les contraintes sur ce qu'est un train sont relativement faibles. 
Il doit seulement avoir un identifiant, qui permet aux autres systèmes de garder des références vers des trains.

## Exigences de conception

- Les trains **occupent les zones**.
- Les trains doivent être **suivis** pour préserver leur **ordre de passage**.
- Les trains ont pour responsabilité de **demander les itinéraires** devant eux.
