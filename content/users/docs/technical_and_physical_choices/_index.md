---
title: "Choix techniques et physiques"
linkTitle: "Choix techniques et physiques"
weight: 30
---

L'outil OSRD peut être utilisé pour effectuer deux types de calcul :

- **Calcul de marche** (Standalone train simulation) où le calcul du temps de parcours est effectué sans interaction entre le train et le système de signalisation.
- **Simulation** de plusieurs trains où une simulation dynamique réelle est exécutée et les trains intéragissent entre eux et avec le système de signalisation.

### <font color=#aa026d>Les données d'entrée</font>

Les données d'entrée se présentent en 4 étapes.

- **L'infrastructure :** Topologie des lignes et des voies, position des gares et bâtiments voyageurs, position et type des aiguilles, signaux, vitesses maximales liées à l’infrastructure, profil de ligne corrigée (pentes, rampes et virages).

![Infrastructure](infrastructure.png)

> L’histogramme est une représentation des déclivités en [‰] par position en [m] (mètres). Les déclivités sont positives pour les rampes et négatives pour les pentes :
>
> - la ligne bleue représente les virages (de rayons de courbures en [m]) ;
> - la ligne orange représente le profil cumulé.

<p>&nbsp;</p>

- **Le matériel roulant :** Sélection d’un train avec toutes les caractéristiques nécessaires pour effectuer la simulation.

![Matériel roulant](mat_roulant.png)
<p>&nbsp;</p>

- **Les marges :** Temps ajouté à la totalité du trajet :

  - en [s] (secondes),
  - en pourcentage du temps parcours,
  - en [s/100 m].
Il est également possible d'ajouter du temps en [s] par intervalle.

![Marge](marges.png)
<p>&nbsp;</p>

- **Les horaires :** Heures de départ du train pour le mode « calcul de marche », tableau des horaires de passage pour le mode « simulation ».

![Horaire de départ](timetables.png?style=time)
<p>&nbsp;</p>

### <font color=#aa026d>Les résultats</font>

Les résultats sont affichés sous la forme de deux graphiques.

- **Le graphique espace/temps (GET) :**

![Graphique Espace/Temps](graph_espace_temps.jpg)
> L’axe **x** est l’horaire de passage du train, l’axe **y** est la position du train en [m].
Lorqu'un train est sélectionné :
>
> - la ligne bleue représente le calcul de marche le plus tendu pour le train
> - la ligne verte représente le calcul de marche « économique » du train, avec ajout d’une marge
> - les carrés pleins représentent la portion de la voie reservée au passage du train
> - les lignes jaunes et rouges représentent l'occupation du canton par le train. C'est l'écart minimal autorisé entre 2 trains présents sur une même voie.

<p>&nbsp;</p>

- **Le graphique espace/vitesse (GEV) :**

![Graphique Espace/Vitesse](graph_espace_vitesse.png)
> L’axe **x** est la position du train en [m], l’axe **y** est la vitesse du train en [km/m] :
>
> - la ligne violette représente la vitesse maximale autorisée
> - la ligne bleue est construite à partir du calcul de marche le plus tendu pour le train
> - la ligne verte représente le calcul de marche « économique » du train, avec ajout d’une marge

<style>
img[src$="time"] {
  height: 70%;
  width: 70%;
}
</style>
