---
title: "Les marges"
linkTitle: "5 - Les marges"
weight: 50
---

<font color=#aa026d>

### La raison d'être des marges

</font>

Comme expliqué dans le [calcul du Max Effort Profile](../pipeline/#calcul-du-profil-deffort-maximal), la **marche de base** représente la marche la plus tendue normalement réalisable, c'est-à-dire le trajet le plus rapide possible du matériel donné sur le parcours donné. Le train accélère au maximum, roule aussi vite que possible en fonction des différentes limites de vitesse et de ses capacités motrices, et freine au maximum.

Cette marche de base présente un inconvénient majeur : si un train part avec 10min de retard, il arrivera au mieux avec 10min de retard, car par définition il lui est impossible de rouler plus vite que la marche de base. Par conséquent, les trains sont programmés avec un ajout d'une ou de plusieurs marges. Les marges sont une détente du trajet du train, un ajout de temps à l'horaire prévu, qui se traduit inévitablement par un abaissement des vitesses de circulation.

> Un train circulant en marche de base est incapable de rattraper son retard !

<font color=#aa026d>

### Le type de marge

</font>

On distingue deux types de marges :

- **La marge de régularité** : il s'agit du temps complémentaire ajouté à la marche de base pour tenir compte de l’imprécision de la mesure de la vitesse, pour pallier les conséquences des incidents extérieurs venant perturber la marche théorique des trains, et pour maintenir la régularité de la circulation. La marge de régularité s'applique sur l'ensemble du trajet, bien que sa valeur puisse changer sur certains intervalles.
- **La marge de construction** : il s'agit du temps ajouté / retiré sur un intervalle spécifique, en plus de la marge de régularité, mais cette fois pour des raisons opérationnelles (esquiver un autre train, libérer une voie plus rapidement, etc.)

Une marche de base à laquelle on vient ajouter une marge de régularité donne ce que l'on appelle une **marche type**.

<font color=#aa026d>

### La distribution de la marge

</font>

L'ajout de marge se traduisant par un abaissement des vitesses le long du trajet, plusieurs marches types sont possibles. En effet, il existe une infinité de solutions aboutissant au même temps de parcours.

En guise d'exemple simple, pour détendre la marche d'un train de 10% de son temps de parcours, il est possible de prolonger n'importe quel arrêt de l'équivalent en temps de ces 10%, tout comme il est possible de rouler à 1/1,1 = 90,9% des capacités du train sur l'ensemble du parcours, ou encore de rouler moins vite, mais seulement aux vitesses élevées...

Il y a pour l'instant deux algorithmes de distribution de la marge dans OSRD : linéaire et économique.

<font color=#aa026d>

### La distribution linéaire

</font>

La distribution de marge linéaire consiste simplement à abaisser les vitesses d'un même facteur sur la zone où l'utilisateur applique la marge. En voici un exemple d'application :

![Python plot linear](../python_plot_linear.png)

Cette distribution a pour avantage de répartir la marge de la même manière sur tout le trajet. Un train prenant du retard à 30% de son trajet disposera de 70% de sa marge pour les 70% de trajets restants.

<font color=#aa026d>

### La distribution économique

</font>

La distribution économique de la marge, présentée en détail dans [ce document](/pdf/MARECO.pdf) (**MARECO** est un algorithme conçu par la direction de la recherche SNCF), consiste à répartir la marge de la manière la plus économe possible en énergie. Elle est basée sur deux principes :

1. une vitesse plafond, évitant les vitesses les plus consommatrices en énergie
2. des zones de marche sur l'erre, situées avant les freinages et les fortes pentes, où le train circule à moteur coupé grâce à son inertie, permettant de ne consommer aucune énergie pendant ce laps de temps

![Python plot eco with slopes](../python_plot_eco_w_slopes.png)

> Un exemple de marche économique. En haut, les pentes/rampes rencontrées par le train. Les zones de marche sur l'erre sont représentées en bleu.
