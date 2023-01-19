---
title: "Contexte métier"
linkTitle: "1 - Contexte métier"
weight: 10
---

Quelques définitions :

### La capacité

La **capacité**, dans ce contexte, correspond à la possibilité de
réserver des éléments d'infrastructure pour permettre le passage
d'un train.

La capacité s'exprime en fonction de l'espace et du temps :
la réservation d'un élément peut bloquer une zone précise
qui devient inaccessible aux autres trains, et cette réservation
se fait sur un intervalle de temps.

On peut la représenter
sur un graphique, avec le temps en abscisse et la distance parcourue
sur un chemin en ordonnée.

![Graphique espace temps](space_time_chart.png)

> Exemple d'un graphique espace-temps montrant le passage d'un train.
>
> Les couleurs représentent ici les aspects des signaux, mais
> montrent également une consommation de la capacité :
> quand ces blocs se superposent pour deux trains, ils sont en conflit.

Deux trains d'une grille horaire sont en **conflit**
quand ils réservent en même temps un même objet, dans des
configurations incompatibles.

![Graphique espace temps avec conflit](conflict.png)

> Exemple d'un graphique espace-temps avec conflit : le second train
> est plus rapide que le premier, ils sont en conflit sur la fin du trajet,
> quand les rectangles se superposent.
>
> En essayant de simuler cette grille horaire, le second train serait
> ralentis par des signaux indiquant de ralentir, provoqués par la
> présence du premier train.

La consommation de capacité est souvent représentée sous la forme de
rectangles car, dans les systèmes de signalisation les plus simples,
il s'agit de réservations d'une zone fixe dans l'espace pendant un intervalle de temps donné.



### Les sillons horaires

Un **sillon** correspond à une réservation de capacité pour le
passage d'un train. Il est fixé dans l'espace et dans le temps :
le temps de départ et le chemin emprunté sont connus.
Sur les graphiques espace-temps de cette page, un sillon correspond
à l'ensemble des blocs pour un train.

Dans un fonctionnement habituel, le gestionnaire d'infrastructure
(ex : SNCF Réseau) propose des sillons à la vente pour les entreprises
ferroviaires (ex : SNCF voyageur).

À une date donnée avant le jour de
circulation prévu, tous les sillons sont attribués. Mais **il peut rester
assez de capacité pour faire rouler plus de trains**. Il est
possible de placer des trains entre les sillons déjà établis,
quand ces derniers sont suffisamment espacés ou n'ont pas
trouvé d'acheteurs.

La capacité restante après l'attribution des sillons est appelée 
la **capacité résiduelle**. Le problème traité ici est la recherche
de sillons dans celle-ci. 
