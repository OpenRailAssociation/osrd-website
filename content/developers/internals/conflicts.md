---
title: "Détection des conflits"
linkTitle: "Conflits"
weight: 100
description: "Détecte les conflits entre les différents train de la grille horaire"
---

## Définition

Normalement, chaque signal vu par un train devrait afficher son état
le moins restrictif (généralement voie libre).
Si un train voit un autre état à cause de la présence d'un autre train dans
la grille horaire, on considère que les deux trains sont en conflit.

## Fonctionnement

_note: le comportement décrit ici n'est pas encore implémenté,
la détection est pour l'instant très simplifiée._


### Core

Quand on réalise un calcul de marche dans le core, la réponse inclue
des informations sur l'état de la signalisation. D'une part elle contient
les changements d'états des signaux, à afficher sur le graphique espace
temps et sur la carte, mais ces informations ne sont pas suffisantes pour
détecter les conflits. Il y a donc, d'autre part, un ensemble d'intervalles
où un signal est considéré comme "non libre". Ce sont ces intervalles qui
sont utilisés pour détecter les conflits.

Le calcul de ces intervalles utilise une simulation de la signalisation,
mais avec un comportement particulier sur les itinéraires. La signalisation
considère que chaque itinéraire est enclenché quand il _peut_ l'être. Ainsi, on
peut correctement calculer la cascade de signaux en amont d'un carré marquant
le début d'un itinéraire en conflit avec le train simulé.

_todo: faire beaucoup de dessins parce que c'est pas clair_


### API

Le service d'API a accès aux résultats de chaque simulation, et des nouveaux
appels au core seraient superflus. C'est donc ce service qui calcule les
conflits.

Pour chaque signal sur le parcours des trains, pendant l'intervalle de temps
où il est visible par le train, on cherche s'il est marqué
comme "non libre" par un autre train. Si c'est le cas, on note un conflit
qui débute à l'instant où le signal est vu sous un état non libre, et
se termine quand il est de nouveau libre.

Par exemple : si un signal montre un sémaphore de t=100 à t=200
puis un avertissement de t=200 à t=300,
et qu'un autre train voit le signal à partir de t=150, on note
un conflit de t=150 à t=300.

Un conflit est exprimé sous la forme d'un temps de début, un temps de fin,
et un identifiant de signal ou de canton. Si le canton est sur le chemin
projeté, on ajoute des informations de position permettant
d'afficher le conflit.
