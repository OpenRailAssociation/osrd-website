---
title: "Espacement"
linkTitle: "Espacement"
weight: 50
description: "Gère l'état des cantons"
---

## Couche de cantonnement

La couche de cantonnement gère des routes de signal à signal (canton).
Elle permet à la signalisation d'observer l'état d'un groupe
de zones protégées par chaque signal, et de trouver le signal
suivant dans la chaîne.

Chaque canton porte les informations statiques suivantes:

- les zones protégées par le canton, et leur configuration attendue (ce qui inclus l'état des éléments mobiles)
- les signaux de début et de fin (optionnels)

Un canton est **actif** si tous ses éléments mobiles sont dans la position requise.

{{% alert title="TODO" color="warning" %}}
Un canton devrait-il être actif quand toutes ses zones sont dans la configuration requise ? Dans ce cas, les cantons de sens contraire seront inactifs.
{{% /alert %}}

## État

L'état du canton est une combinaison de:

- si toutes les zones sont correctement réservées
- si une des zones est occupée

```rust
struct SignalingRouteState {
    reserved: bool,
    occupied: bool,
}
```

Les cantons n'ont pas d'état persistant. Ils sont à tout instant capables de recalculer leur état.

## Opérations

- On peut demander, étant une liste de signaling routes partant du même point, laquelle est **active** (si il y en a une), et son état. Cette opération est commune à la couche d'API, et non à une signaling route en particulier.

## Exigences de conception

- chaque signal doit connaître le **prochain signal compatible**
- chaque signal doit connaître les **zones qu'il protège**
- **compatibilité modules signalisation** : les modules doivent créer les cantons entre chaque signaux. Chaque canton a un système de signalisation associé.
- **compatibilité pathfinding** : Le pathfinding se fait dans le produit du graphe de routage et du graphe de cantons.
