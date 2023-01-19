---
title: "Marge de régularité"
linkTitle: "5 - Marge de régularité"
weight: 50
---


Une des fonctionnalités qui doit être supportée par STDCM est la
[marge de régularité]({{< ref "docs/explanation/running_time_calculation/allowances" >}} "marge de régularité").
L'utilisateur doit pouvoir indiquer une valeur
de marge, exprimée en fonction de la distance ou du temps de parcours,
et cette marge doit être ajoutée au trajet.

> Par exemple : l'utilisateur peut indiquer une marge de 5 minutes au
> 100km. Sur un trajet de 42km, un trajet de 10 minutes au plus rapide
> doit maintenant durer 12 minutes et 6 secondes.

Le problème se situe au niveau de la détection de conflits.
En effet, ralentir le train décale l'ensemble du sillon dans le temps
et augmente la capacité consommée.
La marge doit donc être prise en compte pendant l'exploration
pour détecter correctement les conflits.

Pour plus de difficulté, la marge doit suivre le modèle
[MARECO](/pdf/MARECO.pdf).
La marge n'est pas répartie uniformément sur le trajet, mais selon
un calcul qui nécessite de connaître l'ensemble du trajet.

#### Marge linéaire exprimée en fonction du temps de parcours

Pour commencer, le problème est résolu avec une marge linéaire,
c'est-à-dire répartie uniformément sur le parcours du train.
La vitesse est simplement multipliée par un facteur constant.

Les [enveloppes]({{< ref "docs/explanation/running_time_calculation/envelopes_system" >}} "enveloppes").
calculées pendant l'exploration du graphe ne sont
pas modifiées, celles-ci sont toujours à vitesse maximale.
Mais elles sont accompagnées du facteur de vitesse, qui est utilisé
pour calculer les temps de parcours et les conflits.

C'est seulement quand le chemin est trouvé que la marge est appliquée à
l'enveloppe finale. Parce qu'il s'agit uniquement de multiplication par un
facteur, les conflits ne peuvent pas apparaître ici.

#### Marge linéaire exprimée en fonction de la distance

Le principe ici est généralement similaire, mais avec une difficulté
supplémentaire : le facteur n'est pas constant au long du trajet.
En effet, un train roulant à faible vitesse parcours moins de distance
dans un même intervalle de temps qu'un train à pleine vitesse.
La vitesse est réduite d'un facteur plus faible quand le train
roule moins vite.

Comme le train ne roule pas à vitesse constante pendant son trajet,
le facteur de vitesse évolue d'une arête à l'autre.
Cela provoque des courbes de vitesse irrégulières.

#### Marge mareco

Il s'agit ici exclusivement d'un post-traitement, car il est impossible
de calculer une courbe mareco sans connaître l'intégralité du trajet.
La détection de conflit pendant l'exploration se base exclusivement
sur la courbe avec une marge linéaire.

Cela implique que des conflits peuvent apparaître pendant cette étape.
Pour les éviter, la procédure suivante est appliquée :
 1. Une marge est appliquée à la courbe sur l'ensemble du trajet
avec l'algorithme mareco
 1. Le premier conflit provoqué par le changement est recherché
 1. S'il existe, *l'application de mareco sera séparée en deux
intervalles*. Le point à la position du conflit est alors fixé
dans l'espace-temps par rapport à la courbe avec une marge linéaire,
qui elle ne génère pas de conflit.
 1. Le procédé est répété itérativement jusqu'à une absence de conflit.
