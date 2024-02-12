---
title: "Train simulation v3"
linkTitle: "Train simulation v3"
description: "Modeling and API design of train simulations"
weight: 45
---

{{% pageinfo color="warning" %}}
This is a work in progress
{{% /pageinfo %}}

After two years of implementing features into a very simple model, it appeared that fundamental
changes are required to meet our needs. This document goes into:

- what are the system's current and projected requirements
- how train simulation is currently implemented
- the shortcomings of the current model
- what was discussed during the design process, and the outcomes of individual discussions
- the specification for the new design
- a discussion of the new design's limitations
- a list of questions designed to challenge design limits, answered by domain experts


# System requirements

The new system is expected to:

- be easy to integrate with [timetable v2](../timetable/)
- be usable both for incremental simulations and batch
- follow a schedule during batch simulations
- handle rich train state vectors (pantograph, battery state)
- handle realistic reactions to signaling
- provide a low-level API, usable independantly
- integrate a pluggable margin algorithm API

In the long-term, this system is expected to:

- be used to drive multi-train simulations
- handling switching rolling stock at stops
- integrate driver behavior properties


# Previous implementation

The current implementation has a number of shortcomings which aren't aligned with current system requirements

## Definition of margins

Margins / scheduled points are defined as post-processing filter passes on simulation results.

Simulation results are not, and cannot be easily made to be the result of a single consistent simulation, as:
- margins work by performing partial simulations, and intersecting results with the existing base, which:

   - makes the implementation very brittle, as margin passes have the burden to preserve simulation result continuity

Caractéristiques du modèle actuel :

* l'état du train se résume uniquement à un couple position/vitesse en un point de la courbe
* le calcul de marche est calculé par morceaux, mais pas de manière causale
* le recollage entre les morceaux peut échouer à cause d'incompatibilités aux extrêmités (potentiellement échouant à trouver une solution pourtant possible)
* le calcul des marges nécessite du backtracking

## Quels sont les problèmes du modèle actuel ?

Il est impossible d’ajouter des paramètres supplémentaires comme l’état d’une batterie, un temps système...
Par exemple, lors d'un signal BP/CC (Baisser Pantographe, Couper Courant), ou une LTV (Limitation Temporaire de Vitesse).

## Marges
Il est à noter que les marges de construction vont disparaître.

{{% pageinfo color="warning" %}}
Il reste une ambiguïté sur le comportement des marges au niveau des transitions entre 2 sections avec des pourcentages différents :
où doit se faire la transition ?
{{% /pageinfo %}}

# Objectifs

Quels sont les objectifs du design des nouvelles API du calcul de marche ?

* pouvoir gérer des contraintes bornées dans le temps (temps système, réaction signalisation)
* pouvoir rajouter des contraintes dynamiquement, ce qui permettra de faire de la simulation multitrains

# Contraintes de design

* simulation causale
* contraintes liées à la signalisation statique (dynamique pour plus tard)
  * contraintes qui varient en fonction de la position du train ou du temps
  * sera utile pour les ralentissements 30, 60 et TIV mobiles, mais aussi les arrêts en gare
* comportements conducteur
* temps système du train
* temps d'arrêt
* intégration STDCM (calcul incrémental)
  * pouvoir reprendre un calcul de marche à un endroit donné
  * pouvoir spécifier des arrêts avec des temps

# Propositions
## Hypothèses de travail

* L'utilisation d'un MRSP (Most Restrictive Speed Profile) global, comme utilisé dans le système actuel, n'est plus valide (la vitesse maximale peut varier avec le temps, par exemple avec une LTV).
* Quelque soit la position sur le chemin, il y a toujours a minima, une contrainte (de vitesse maximale notamment)
* Toutes les contraintes de vitesse maximale sont bornées dans l'espace et potentiellement dans le temps, générant des événements aux bornes

Les types de contraintes sont :

* un signal qui change
* les extrémités de LTV
* les extrémités de zones BP/CC
* les changements de palier de MRSP
* les arrêts

## Nouvel algorithme pour le calcul de marche de base

Il est possible d'ordonner tous les événements (les bornes de contraintes) dans l'espace, selon leur position le long du chemin.
Il est ensuite possible de faire une intégration numérique jusqu'au prochain événement (vitesse atteinte, position atteinte, heure dépassée, etc.).
Si la contrainte n'est pas dépassée, l'intégration est continuée jusqu'au prochain événement (par exemple, le train est rentré dans une zone LTV, mais hors des horaires de cette LTV).
Si la contrainte est dépassée, plusieurs cas de figures sont possibles :
* la vitesse maximum a été dépassée, on va alors chercher le point précis d'intersection entre la courbe d'accélération et la vitesse maximale, et reprendre la simulation à partir de ce point
* la vitesse contrainte est plus basse que la vitesse courante (contrainte d'un arrêt par exemple, où une vitesse nulle est attendue) ; dans ce cas, on calcule la courbe de freinage pour aller trouver le point d'intersection entre la courbe de simulation actuelle et la courbe de freinage, puis on reprend la simulation à partir de ce point

### Option bis

On peut précalculer les courbes de freinage correspondant à toutes les contraintes.
En calculant les intersections entre les courbes de freinage et les MRSP, on obtient de nouveaux événements à ordonner.
Cela évite le _backtracking_. 

{{% pageinfo color="warning" %}}
Cependant, il y a un doute sur des cas particuliers où les événements seraient mal ordonnées.
Contraintes proches, avec des courbes de freinage qui s'intercroisent, dans ce cas hypothétique, les intersections seraient ordonnées dans le sens inverse des événements de contrainte 🤷.
En théorie, les courbes de freinage ne se croisent pas, mais cet exemple permet de donner une intuition de situations particulières qui pourraient invalider cette option bis d'algorithme.
À creuser.
{{% /pageinfo %}}

### Exemple

![Exemple de déroulement de l'algorithme](base-simulation.svg)

#### Étape 1

Le trajet possède 3 sections différentes de vitesse maximales (MRSP) en rouge.
Il y a également une LTV avec un début et une fin de section, en orange.
Enfin, il y a un arrêt en station en fuschia.

#### Étape 2

On lance une intégration pour accélérer jusqu'à rencontrer la première contrainte qui est le point d'entrée de la LTV.
Le train arrive à ce point à 8h, donc avant que la LTV ne soit active.

#### Étape 3

L'intégration se poursuit normalement jusqu'à atteindre une limite MRSP.

#### Étape 4

La vitesse se maintient jusqu'à atteindre un changement de MRSP.

#### Étape 5

Le prochain MRSP demande une vitesse plus basse.
On commence une intégration de freinage pour trouver l'intersection avec la courbe de simulation déjà calculée.
La simulation reprend à partir de ce point d'intersection, en ajoutant la courbe de freinage calculée.

#### Étape 6

La vitesse se maintient jusqu'à atteindre l'arrêt en station.

#### Étape 7

L'arrêt en station nécessite une vitesse nulle, or le train n'a pas une vitesse nulle.
On commence une intégration de freinage pour trouver l'intersection avec la courbe de simulation déjà calculée.
La simulation reprend à partir de ce point d'intersection, en ajoutant la courbe de freinage calculée.

#### Étape 8

La courbe de simulation jusqu'à la station est terminée.

## Questions non-résolues

* Quelles sont les différentes conditions de fin de validité d'une instruction liée à un signal ?
* Remettre en question le modèle défini
* En fin de section contrainte (LTV par exemple), doit-on tenir compte de l'événement ou pas ? En réalité, ça va probablement dépendre de si la borne d'entrée à été prise en compte.
