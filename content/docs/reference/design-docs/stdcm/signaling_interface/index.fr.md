---
title: "Interface avec la signalisation"
linkTitle: "3 - Interface avec la signalisation"
weight: 30
---

Cette interface est encore en cours de conception.

#### Objectifs et contraintes

L'interface doit respecter plusieurs critères :

- Les calculs se basent sur le nouveau modèle de signalisation,
avec la notion de réservations d'objets capacitaires
- Les sillons générés ne doivent jamais générer de nouveaux conflits :
l'interface peut être pessimiste sur les possibilités, mais jamais
plus permissive que la réalité.
- Idéalement, le module de recherche de sillon devrait rester
un bloc indépendant avec un minimum de changements (dans la mesure
du possible).

L'objectif serait donc d'interpréter le modèle de signalisation,
pour générer des entrées valides pour le module de recherche
de sillon : un graphe d'infrastructure et des intervalles
de disponibilités de sections.


#### Difficultés

La plupart des contraintes établies par la signalisation peuvent
facilement s'exprimer sous la forme de sections non disponibles,
sauf dans un cas : le comportement de la signalisation peut dépendre
du chemin emprunté par le train. Pour être capable d'exprimer les
disponibilités sur une zone, il peut être nécessaire de devoir
anticiper la direction du train.


#### Solution proposée

La proposition est d'écrire un nouveau module qui se brancherait au module
de signalisation pour gérer les entrées pour la recherche
de sillon. Il effectuerait un parcours du graphe des itinéraires
pour construire progressivement un graphe avec occupations au bon
format.

À chaque itinéraire visité, l'algorithme regarde jusqu'où il est possible
de déterminer l'ensemble des occupations, c'est-à-dire quel
est le premier signal dont l'état dépend du prochain choix
d'itinéraire du train. Une arête est alors générée jusqu'à ce point,
avec les occupations.

La partie restante de l'itinéraire n'est pas encore considérée.
C'est seulement lorsque le graphe est exploré un niveau plus loin,
avec l'itinéraire suivant, que la fin de l'itinéraire précédent
est intégrée. Elle fait alors partie de l'arête suivante,
car à ce moment davantage d'informations sont disponibles sur le
trajet du train.

Par exemple :

![Configuration nécessitant d'anticiper](example_interface_signaling_1.svg)

Dans cette configuration en BAL3, il est possible de déterminer
l'absence de conflit des signaux 1 à 4. Mais l'état du signal
5 dépend de l'itinéraire emprunté par le train : s'il va vers
le haut, le signal 5 affiche un avertissement. Dans le cas
contraire, il affiche un "voie libre".

![Arêtes générées](example_interface_signaling_2.svg)

Dans cet exemple, une première arrête est alors générée, allant
du premier signal jusqu'à la première incertitude : le point
où le signal 5 est visible.

Dans un second temps, une nouvelle arête est générée pour chaque itinéraire
accessible depuis la fin du précédent : un vers A, l'autre vers B.
La zone entre le signal 5 et l'aiguille sera donc dupliquée
entre les deux arêtes, mais les occupations dans cette région seront
différentes.

Ce graphe peut être généré au fil de l'exploration, sans surcoût
initial.