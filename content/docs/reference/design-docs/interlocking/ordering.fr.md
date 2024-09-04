---
title: "Ordonnancement"
linkTitle: "Ordonnancement"
weight: 55
description: "Décide de l'ordre de formation des itinéraires"
---

{{% alert color="warning" %}}
Cette page est une ébauche, contribuez-y!
{{% /alert %}}


## Définition

La couche d'ordonnancement a pour responsabilité d'établir l'ordre de commande des itinéraires, et par conséquent, l'ordre de passage des trains.
La méthode exacte utilisée pour prendre cette décision n'importe pas, du moment qu'elle garantit que la simulation se termine (elle ne doit pas amener de trains en nez-à-nez, ou créer d'autres cas de figure de blocage).

Il est possible d'implémenter un module d'ordonnancement via des tableaux d'ordre de succession des trains aux aiguilles.

## Exigences de conception

- Il doit être possible de connecter n'importe quel algorithme d'ordonnancement
- Le module d'ordonnancement doit approuver les commandes de routes.

## Opérations

- **train**: Des itinéraires sont **commandés** pour chaque trains, aussi loin et aussi tôt que possible. L'approbation de la commande est soumise au régulateur, qui peut la retarder indéfiniment, selon des critères de son choix.
