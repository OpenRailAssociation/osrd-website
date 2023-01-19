---
title: "Représentation de l'espace de solutions"
linkTitle: "2 - Représentation de l'espace de solutions"
weight: 20
---

#### Principe général

Le problème reste une recherche de graphe. En représentant
l'espace de solution sous forme de graphe, il est possible de réutiliser
nos outils déjà existants de recherche de chemin.

Le *graphe produit* de la position, du temps, et de la vitesse est utilisé.
Autrement dit, chaque élément du graphe contient (entre autres) ces
3 variables.

Chaque arête du graphe est calculée avec un
[calcul de marche]({{< ref "docs/explanation/running_time_calculation/" >}} "calcul de marche")
pour connaître l'évolution de la vitesse et de la position dans le temps.


#### Représentation visuelle

Le graphe de départ représente l'infrastructure physique

![Graphe produit (1/3)](routes_time_1.png)

Il est ensuite "dupliqué" à des temps différents

![Graphe produit (2/3)](routes_time_2.png)

Puis des nœuds sont reliés de manière à refléter le temps de parcours

![Graphe produit (3/3)](routes_time_3.png)


#### Précisions


- Le graphe est construit *au fil de l'exploration*.
- Une discrétisation est faite au niveau du temps, uniquement pour
évaluer ce qui a déjà été visité. Si le même emplacement est visité une
seconde fois, il faut une certaine différence de temps pour estimer
qu'il n'est pas déjà visité.
- Toutes les arêtes sont réalisées avec des calculs de marche
- La vitesse n'est pas discrétisée ni utilisée pour estimer quel
emplacement est déjà visité, mais elle fait partie des calculs.
- Par défaut, tous les calculs sont faits en allant à la vitesse maximale.
Les ralentissements sont ajoutés seulement quand ils sont nécessaires.


#### Exemple

Par exemple, avec l'infrastructure suivante en se basant sur
le graphe des voies :
![Infra d'exemple](example_infra.svg)

Explorer le graphe des sillons possibles peut donner ce
type de résultat :
![Représentation du graphe](example_graph.svg)