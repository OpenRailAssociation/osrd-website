---
title: "Choix techniques et phyiques"
linkTitle: "Choix techniques et phyiques"
weight: 30
---

L'outil OSRD peut être utilisé pour effectuer deux types de calcul :

- **Calcul de marche** (Standalone train simulation) où le calcul du temps de parcours est effectué sans interaction entre le train et le système de signalisation.
- **Simulation** de plusieurs trains où une simulation dynamique réelle est exécutée et les trains intéragissent entre eux et avec le système de signalisation.

#### 1 - Les données d'entrée

Les données d'entrée se présentent en 4 étapes.

- **L'infrastructure :** Topologie des lignes et des voies, position des gares et battements voyageurs, position et type des aiguilles, signaux, vitesses maximales liées à l’infrastructure, profil de ligne corrigée (pentes, rampes et virages).

![Infrastructure](infrastructure.png)

> L’histogramme est une représentation des déclivités en [‰] par position en [m], les déclivités sont positives pour les rampes et négatives pour les pentes; la ligne bleue est une représentation des virages en termes de rayons des courbures en [m]; la ligne orange représente le profil cumulé.

- **Le matériel roulant :** Sélection d’un train avec toutes les caractéristiques nécessaires pour effectuer la simulation.

![Matériel roulant](materiel_roulant.png)

- **Les marges :** Temps ajouté à la totalité du trajet en [s], en pourcentage du temps parcours ou en [s/100 m]. Il est également possible d'ajouter du temps en [s] par intervalle.

![Marge](marges.png)

- **Les horaires :** Temps de départ du train pour le mode «calcul de marche», tableau des horaires de passage pour le mode «simulation».

![Horaire de départ](timetables.png?style=time)

#### 2 - Les résultats

Les résultats sont affichés sur forme de deux graphiques.

- **Le graphique espace/temps (GET) :**

![Graphique Espace/Temps](graph_espace_temps.jpg)
> L’axe **x** est l’horaire de passage du train, l’axe **y** est la position du train en [m] ; la ligne bleue représente le calcul de marche le plus tendu pour le train, la ligne verte représente le calcul de marche « économique » du train avec l’ajout d’une marge, les carrés pleins représentent la portion de la voie reservée au passage du train.

- **Le graphique espace/vitesse (GEV) :**

![Graphique Espace/Vitesse](graph_espace_vitesse.png)
> L’axe **x** est la position du train en [m], l’axe **y** est la vitesse du train en [km/m] ; la ligne violette représente la vitesse maximale autorisée, la ligne bleue représente la vitesse dans le cas du calcul de marche le plus tendu pour le train, la ligne verte représente la vitesse dans le cas du calcul de marche « économique » du train avec l’ajout d’une marge.



<style>
img[src$="time"] {
  height: 70%;
  width: 70%;
}
</style>
