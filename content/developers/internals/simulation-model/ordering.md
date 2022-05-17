---
title: "Ordonnancement"
linkTitle: "Ordonnancement"
weight: 55
description: "Décide de l'ordre de formation des itinéraires"
---

## Définition

La couche d'ordonnancement a pour a responsabilité d'établir l'ordre de commande des itinéraires, et par conséquent, l'ordre de passage des trains.
La méthode exacte utilisée pour prendre cette décision n'importe pas, du moment qu'elle garanti que la simulation se termine (elle ne doit pas amener de trains en nez-à-nez, ou créer d'autre cas de figure de blocage).

Il est possible d'implémenter un module d'ordonnancement via des tableaux d'ordre de succession des trains aux aiguilles.

## Exigences de conception

- Il doit être possible de connecter n'importe quel algorithme d'ordonnancement
- Le module d'ordonnancement doit blocker puis redémarrer des demandes d'itinéraire.

## Opérations

- **train**: Le train **demande les itinéraires** devant lui, aussi loin qu'il peut. Sa demande peut être mise en attente du passage d'un autre train.