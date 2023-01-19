---
title: "Description du format d'entrée"
linkTitle: "1 - Description du format d'entrée"
weight: 10
---

Ce module prend plusieurs entrées pour effectuer une recherche de chemin :

- Un graphe décrivant l'infrastructure physique
- Des zones non disponibles selon des intervalles de temps
- Des points de départ et d'arrivée
- Une fenêtre de départ
- Un temps de parcours maximal
- Des données de simulation (matériel roulant, time step, marges, etc)

Parmi ces entrées, les deux premières méritent d'être détaillées.

#### Graphe d'infrastructure

Aujourd'hui, le graphe donné en entrée correspond au graphe
des `SignalingRoutes`. Mais il peut s'agir de n'importe quel graphe
orienté permettant de naviguer l'infrastructure physique.

Les seules contraintes sont : les arêtes doivent avoir une longueur,
et il doit être possible d'effectuer un calcul de marche sur des
sections d'arêtes.

#### Zones non disponibles

Cette entrée représente les zones inaccessibles à cause de contraintes
de capacité.

À chaque arête du graphe est associé un ensemble de "bloc d'occupation".
Un bloc est composé d'une distance de début et de fin (relative
au début de l'arête), et un temps de début et de fin.
Il est considéré que la *tête* du train ne peut pas se trouver dans cette
zone dans l'intervalle de temps donné.

Ces blocs encodent également la marge de grille : s'il faut rajouter
`x` secondes de marges avant le train, chaque bloc est agrandi de
`x` secondes dans un sens.

Pour donner un exemple, avec la grille horaire suivante, en
supposant une arête par canton, un train de 42m et
une distance de visibilité de 10m :

![Exemple de sections non disponibles](unavailable_sections.svg)

- L'occupation du canton 1 de t=0 à t=300 le rend non disponible
dans sa globalité pendant cette période.

- Les 10 derniers mètres du canton 1 sont non disponibles de t=300 à t=360,
car le signal en début de canton 2 doit être vert quand le conducteur le voit.
Il est possible de considérer que ce bloc-ci commence à t=130
(quand le canton du signal suivant n'affiche plus de vert),
une superposition
de blocs n'étant pas problématique.

- L'occupation du canton 2 de t=130 à t=360 le rend non disponible
pendant cette période. Il est également non disponible à partir de
t=0, car la présence d'un train provoquerait un avertissement sur
le canton 1 quand il est utilisé par le train déjà planifié.

- Les 42 premiers mètres du canton 3 sont non disponibles de t=0 à t=360,
car la queue du train doit avoir libéré le second canton.

- Le reste du canton 3 est non disponible dans sa globalité
de t=280 à t=360.