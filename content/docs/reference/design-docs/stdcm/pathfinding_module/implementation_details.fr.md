---
title: "Détails d'implémentation"
linkTitle: "6 - Détails d'implémentation"
weight: 60
---


Cette page précise certains détails d'implémentation.
Sa lecture n'est pas nécessaire pour comprendre les principes
généraux, mais peut aider avant de se plonger dans le code.


#### STDCMEdgeBuilder

Cette classe est utilisée pour simplifier la création d'instances de `STDCMEdge`,
les arêtes du graphe. Celles-ci contiennent de nombreux attributs,
la plupart pouvant être déterminés en fonction du contexte (comme
le nœud précédent). La classe `STDCMEdgeBuilder` permet de rendre
certains attributs optionnels et en calcule d'autres.

Une fois instancié et paramétré, un `EdgeBuilder` a deux méthodes :

- `Collection<STDCMEdge> makeAllEdges()` permet de créer toutes
les arêtes possibles dans le contexte donné pour une route donnée.
S'il y a plusieurs "ouvertures" entre des blocks d'occupation,
une arête est créée par ouverture. Tous les conflits, leurs
évitements et les attributs associés sont déterminés ici.

- `STDCMEdge findEdgeSameNextOccupancy(double timeNextOccupancy)` :
Cette méthode permet d'obtenir l'arête passant par une certaine
"ouverture" (quand elle existe), identifiée ici par le temps
de la prochaine occupation sur la route. Elle est utilisée à chaque
fois qu'une arête doit être re-créée dans un contexte différent,
comme pour appliquer une marge ou corriger une discontinuité.
Elle appelle la méthode précédente.


### Recherche de chemin

#### Evaluation des distances

La fonction utilisée pour déterminer la distance (au sens
de la recherche de chemin) détermine quel chemin sera privilégié.
Le chemin obtenu sera toujours le plus court en fonction du critère
donné.

Ici, deux paramètres sont utilisés : le temps de parcours total
et l'heure de départ. Le second a un poids très faible par rapport
au premier, pour sélectionner en priorité le chemin le plus rapide.
Les détails du calcul sont indiqués dans les commentaires des
méthodes concernées.



#### Heuristiques

L'algorithme de recherche de chemin dans le graphe est un A*,
avec une heuristique basée sur les coordonnées géographiques.

Cependant, la géométrie des infrastructures générées sont arbitraires,
elle ne correspond pas aux distances indiquées sur les voies.
Il est donc possible que, sur ces infrastructures, les chemins
obtenus ne soient pas les plus courts.

Il est en théorie possible d'utiliser cette heuristique pour
déterminer si le chemin en cours d'exploration pourra mener à une
solution dont le temps de parcours ne dépasse pas le maximum.
Mais pour la même raison, ajouter ce critère rend STDCM
inutilisable sur les infrastructures générées.
Plus de détails dans
[cette issue](https://github.com/OpenRailAssociation/osrd/issues/2818).

