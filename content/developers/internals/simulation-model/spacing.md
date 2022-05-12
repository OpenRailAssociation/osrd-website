---
title: "Espacement"
linkTitle: "Espacement"
weight: 50
description: "Gère l'état des cantons"
---

# Couche de cantonnement

La couche de cantonnement gère des routes de signal à signal (canton).
Elle permet à la signalisation d'observer l'état d'un groupe
de zones protégées par chaque signal, et de trouver le signal
suivant dans la chaîne.

Chaque canton porte les informations statiques suivantes:
 - les zones protégées par le canton, et leur état attendu
 - les éléments mobiles et leur état attendu
 - les signaux de début et de fin (optionnels)

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

## Exigences de conception

 - chaque signal doit connaître le **prochain signal compatible**
 - chaque signal doit connaître les **zones qu'il protège**
 - **compatibilité modules signalisation**: les modules doivent créer les cantons entre chaque signaux. chaque canton a un système de signalisation associé
 - **compatibilité pathfinding**: Le pathfinding se fait dans le graphe des routes de mouvement, mais les déplacements sont contraints aux chemins qui sont permis par la couche de cantonnement