---
title: "Réaction du train aux signaux"
linkTitle: "Réaction du trian aux signaux"
weight: 80
description: "Décrit le comportement du train en réaction aux signaux"
---

## Exigences de conception

Le modèle de réaction du train aux signaux doit implémenter ces fonctionnalités
pour qu'une simulation dynamique puisse être réalisable :

- Le train doit observer les changements d'états des signaux devant lui
- Les signaux peuvent imposer des contraintes de vitesse aux trains,
sous la forme d'enveloppes de vitesses
- Ces contraintes peuvent être supprimées individuellement à tout moment
- Le train doit essayer de suivre les contraintes en ajoutant des courbes
de freinage et d'accélération, un avertissement est reporté si c'est impossible


D'autres fonctionnalités devront être implémentées plus tard. Elles ne sont
pas aussi bloquantes, mais on doit les garder en tête en réfléchissant au
modèle :

- Le train doit être en mesure de connaître son retard à tout moment
- Le train doit être en mesure de connaître la quantité de marge qui être
consommée pour rattrapper son retard
- Le train peut aller plus vite que l'enveloppe avec marge pour rattraper
son retard, jusqu'à rejoindre la courbe prévue avec le même temps et vitesse


## Questions et points à détailler


- Est-ce que le retard à rattrapper et la marge à consommer sont des
informations définies en tout point du chemin, ou à des points particuliers
(arrêts et PR) ?
- Quel comportement suivre pour rattraper le retard ? Est-ce qu'on fait un
mareco avec une marge plus faible quand c'est possible, ou on va à fond ?


## Proposition d'implémentation

- Un train a deux enveloppes statiques : la vitesse prévue, et la vitesse
maximale autorisée
- Il peut avoir un nombre variable d'enveloppes dynamiques qui peuvent
se superposer. Le train suit la plus restrictive.
- En l'absence de restriction, il suit la vitesse prévue s'il est à l'heure,
sinon la vitesse maximale
- Un train observe un signal tant qu'il est visible. Quand son état change,
le signal peut donner un contrainte sous la forme d'une envelope dynamique

Il reste à définir sous quelle forme représenter la quantité de marge qui peut
être consommée
