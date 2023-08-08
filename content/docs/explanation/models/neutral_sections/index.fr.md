---
title: "Zones neutres"
linkTitle: "Zones neutres"
weight: 20
description: "Documentation des zones neutres et de leur implémentation"
aliases:
    - ../neutral_sections
---

## Objet physique que l'on cherche à modéliser

### Introduction
Pour qu'un train puisse circuler, il faut soit qu'il ait une source d'énergie à bord (fuel, batterie, hydrogène, ...) soit qu'on l'alimente en énergie tout au long de son parcours. 

Pour fournir cette énergie, des câbles électriques sont suspendus au dessus des voies: les *caténaires*. Le train assure ensuite un contact avec ces câbles grâce à un patin conducteur monté sur un bras mécanique: le *pantographe*.

### Zones neutres

Avec ce système il est difficile d'assurer l'alimentation électrique d'un train en continu sur toute la longueur d'une ligne: sur certaines portions de voie, il est nécessaire de couper l'alimentation électrique du train. Ce sont ces portions que l'on appelle **zones neutres**.

En effet, pour éviter les pertes énergétiques le long des caténaires, le courant est fourni par plusieurs sous-stations réparties le long des voies. Deux portions de caténaires alimentées par des sous-stations différentes doivent être isolées électriquement pour éviter les courts-circuits.

Par ailleurs, la façon dont les voies sont électrifiées (courant continu ou non par exemple) peut changer selon les us locaux et l'époque d'installation. Il faut également isoler électriquement les portions de voies qui sont électrifiées différemment. Le train doit aussi (sauf cas particuliers) changer de pantographe lorsqu'il change de type d'électrification.

Dans ces deux cas on indique alors au conducteur de couper la traction du train, et parfois même d'en baisser le pantographe.

Dans l'infrastructure française, ces zones sont signalées par des panneaux d'annonce, d'exécution et de fin. Ces panneaux portent par ailleurs l'indication de baisser le pantographe ou non. Les portions de voies entre l'exécution et la fin peuvent ne pas être électrifiées entièrement, et même ne pas posséder de caténaire (dans ce cas la zone nécessite forcément de baisser le pantographe).  
Parfois, des pancartes *REV* (pour réversible) sont placées en aval des panneaux de fin de zone. Elles sont destinées aux trains qui circulent avec un pantographe à l'arrière du train. Ces pancartes indiquent que le conducteur peut reprendre la traction en toute sécurité.

Par ailleurs il peut parfois être impossible sur une courte portion de voie de placer une caténaire ou bien de lever le pantographe du train. Dans ce cas la ligne est tout de même considérée électrifiée, et la zone sans électrification (passage sous un pont par exemple) est considérée comme une zone neutre.

### Matériel roulant
Après avoir traversé une zone neutre, un train doit reprendre la traction. Ce n'est pas immédiat (quelques secondes), et la durée nécessaire dépend du matériel roulant.

Il doit également, le cas échéant, relever son pantographe, ce qui prend également du temps (quelques dizaines de secondes) et dépend également du matériel roulant.

Ainsi la marche sur l'erre imposée au train s'étend en dehors de la zone neutre, puisque ces temps systèmes sont à décompter à partir de la fin de la zone neutre.

## Modèle de données
Nous avons choisi de modéliser les zones neutres comme l'espace entre les panneaux liés à celle-ci (et non pas comme la zone précise où il n'y a pas de caténaire ou bien où la caténaire n'est pas électrifiée). 

Cette zone est directionnelle, *i.e.* associée à un sens de circulation, pour pouvoir prendre en compte des placements de panneaux différents selon le sens. Le panneau d'exécution d'un sens donné n'est pas nécessairement placé à la même position que le panneau de fin de zone du sens opposé.

Pour une voie à double sens, une zone neutre est donc représentée par deux objets. 

Le schema est le suivant

```json
{
    "lower_pantograph": boolean,
    "track_ranges": [
        {
            "track": string,
            "start": number,
            "end": number,
            "direction": enum
        }
    ],
    "announcement_track_ranges": [
        {
            "track": string,
            "start": number,
            "end": number,
            "direction": enum
        }
    ]
}
```

- `lower_pantograph` : indique si le pantographe doit être baissé dans cette zone
- `track_ranges` : liste des portions de voie où le train ne doit pas tractionner
- `announcement_track_ranges` : liste des portions de voie entre le panneau d'annonce et le panneau d’exécution

## Affichage

### Cartographie
Les zones affichées dans la cartographie correspondent aux `track_ranges`, donc entre les panneaux d’exécution et de fin de zone. La couleur de la zone indique si le train doit baisser son pantographe dans la zone ou non.

La direction dans laquelle la zone s'applique n'est pas représentée.

### Résultat de simulation
Dans l'affichage linéaire, c'est toujours la zone entre EXE et FIN qui est affichée.

## Recherche d'itinéraire
Les zones neutres sont donc des portions de voie "non électrifiées" où un train électrique peut tout de même circuler (mais où il ne peut pas tractionner).

Lors de la recherche de chemin dans l'infrastructure, une portion de voie qui n'est pas couverte par les `track_ranges` d'un objet caténaire (documentation à écrire) peut être empruntée par un train électrique seulement si elle est couverte par les `track_ranges` d'une zone neutre.

## Simulation
Dans la simulation, nous approximons le comportement du conducteur de la façon suivante :
* La marche sur l'erre est entamée dès que la tête du train passe le panneau d'annonce
* Le décompte des temps systèmes (relevé du pantographe et reprise de la traction) commence dès que la tête du train passe le panneau de fin.

Dans la simulation actuelle, il est plus facile de manier des bornes d'intégration spatiales que temporelles. Nous effectuons l'approximation suivante: lors de la sortie de la zone neutre, on multiplie les temps systèmes par la vitesse en sortie de zone. La marche sur l'erre est alors prolongée de la distance obtenue. Cette approximation est raisonnable car l'inertie du train et la quasi-absence de frottement garantissent que la vitesse varie peu sur cet intervalle de temps.

## Potentielles améliorations
Plusieurs points pourraient être améliorés :

- On ne considère pas les pancartes *REV*, tous les trains ne possèdent donc qu'un pantographe à l'avant dans nos simulations.
- Les temps systèmes sont approximés.
- Le comportement conducteur est plutôt restrictif (la marche sur l'erre pourrait commencer après le panneau d'annonce).
- L'affichage des zones est limité: pas de représentation de la direction ou des zones d'annonce.
- Ces zones ne sont pas éditables.
