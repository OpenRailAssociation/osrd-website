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

### Pendant l'exploration


La principale implication de la marge de régularité est pendant
l'exploration du graphe, quand on identifie les conflits.
Les temps et les vitesses doivent être baissés linéairement
pour prendre en compte les conflits au bon moment.
La simulation au plus rapide doit tout de même être calculée
car elle peut définir le temp supplémentaire.

Ce procédé *n'est pas exact* car il ignore la manière dont
la marge est appliquée (en particulier pour MARECO).
Mais à cette étape les temps exacts ne sont pas nécessaires,
il est seulement nécessaire de savoir si une solution existe
à ce temps approximatif.

{{% alert color="info" %}}

Ce procédé inexact peut sembler être un problème, mais en
pratique (pour la SNCF) les marges de régularités ont en
fait une tolérance entre deux points arbitraires
du chemin. Par exemple pour une marge indiquée à 5 minutes
par 100km, une solution avec la marge entre 3 et 7 minutes
entre deux PR serait acceptable. Cette tolérance ne sera
pas encodée explicitement, mais elle
permet de faire des approximations de quelques
secondes pendant la recherche.

{{% /alert %}}


#### Post-processing


Une fois que le chemin est trouvé, il est nécessaire
de faire une simulation finale pour appliquer correctement
les marges. Le procédé est le suivant :

1. Pour certains points du chemin, le temps est fixé.
   C'est un paramètre d'entrée de la simulation qui appelle
   le module de marge. À l'initialisation, le temps est fixé
   à chaque point d'arrêt.
2. Une simulation est réalisée. En cas de conflit, on
   s'intéresse au premier
3. Un point est fixé à la position de ce conflit.
   Le temps de référence est celui considéré pendant l'exploration.
4. Ce procédé est répété itérativement jusqu'à une absence de conflit