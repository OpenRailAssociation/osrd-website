---
title: "Module de recherche de sillons"
linkTitle: "2 - Module de recherche de sillons"
weight: 30
---

Ce module gère la recherche de solution.

Les entrées et sorties sont fortement simplifiées et abstraites
pour simplifier le problème au maximum et permettre des tests efficaces.

Pour décrire son fonctionnement en quelques phrases :
l'espace de solutions est représenté sous forme d'un graphe qui encode le temps,
la position et la vitesse. Une recherche de chemin est ensuite effectuée
dans ce graphe pour trouver une solution. Le graphe est calculé
au fil de son exploration.

Ce graphe peut d'une certaine manière être vu comme une forme
d'arbre de décision, si différents chemins peuvent mener au même noeud.
