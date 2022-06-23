---
title: "Détection des conflits"
linkTitle: "Conflits"
weight: 100
description: "Cette page décrit comment sont détectés les conflits entre les
différents train de la grille horaire"
---

## Définition

Normalement, chaque signal vu par un train devrait afficher son état
le moins restrictif (généralement voie libre).
Si la présence d'un train dans la grille horaire fait qu'un autre
train voit un état plus contraignant (par exemple qui lui impose
de ralentir), on considère que les deux trains sont en _conflit_.


## Fonctionnement de la détection des conflits

_note: le comportement décrit ici n'est pas encore implémenté,
la détection est pour l'instant très simplifiée et limitée
au chemin projeté._


La détection de conflits se fait en plusieurs temps, avec plusieurs
appels entre les services.

Le premier calcul de marche demandé au core renvoie entre autres une liste
d'utilisation de zones. Ensuite, au moment de lister les conflits, on demande
une seconde simulation pour chaque train en prenant en compte
les zones utilisées par les autres trains.


_todo: insérer un schéma des appels_


### Core : calcul de marche initial

Quand on réalise un calcul de marche dans le core, la réponse inclue
déjà des informations sur l'état de la signalisation, mais ce
n'est pas suffisant pour détecter les conflits. On ajoute donc
des informations qui permetteront plus tard de les détecter :
pour chaque zone par laquelle passe le train, on note l'intervalle de temps
où elle est utilisée par le train et dans quelle configuration.


### API : réreption d'une requête demandant les conflits

Quand le service d'API reçoit une demande des conflits, on demande au core
d'effectuer une simulation de la signalisation pour chaque train, en prenant
en compte les utilisations des zones des autres trains.


### Core : seconde simulation de signalisation et détection des conflits

Pour chaque train, on effectue une simulation de la signalisation qui prend
en compte les utilisations de zone des autres trains.
Dès que le train voit un signal qui n'est pas
à son état le moins restrictif, on note un conflit depuis ce moment jusqu'à
l'instant où le signal revient à son état attendu.


## Difficultés avec cette méthode

* On doit effectuer beaucoup de simulations à chaque modification
* Il faut être capable de forcer des états de zones dans la simulation
de la signalisation, en gérant des états incompatibles
* Il peut être difficile de déterminer la durée d'un conflit :
on doit savoir quand le signal serait revenu à son état normal
_sans le second train_
