---
title: "Calcul de marche"
linkTitle: "Calcul de marche"
weight: 30
---

OSRD peut être utilisé pour effectuer deux types de calculs :

- **Calcul de marche** (standalone train simulation) : calcul du temps de parcours d'un train sur un trajet donné, effectué sans interaction entre le train et le système de signalisation.
- **Simulation** : calcul "dynamique" de plusieurs trains interagissant entre eux via le système de signalisation.

#### 1 - Les données d'entrée

Un calcul de marche est basé sur 5 entrées :

- **L'infrastructure :** Topologie des lignes et des voies, position des gares et bâtiments voyageurs, position et type des aiguilles, signaux, vitesses maximales de ligne, profil de ligne corrigée (pentes, rampes et virages).

![Infrastructure](infrastructure.png)

> L’histogramme bleu est une représentation des déclivités en [‰] par position en [m]. Les déclivités sont positives pour les rampes et négatives pour les pentes.
>
> La ligne orange représente le profil cumulé, c'est-à-dire l'altitude relative par rapport au point de départ.
>
> La ligne bleue est une représentation des virages en termes de rayons des courbures en [m].

- **Le matériel roulant :** Dont les caractéristiques nécessaires pour effectuer la simulation sont représentées ci-dessous.

![Matériel roulant](mat_roulant.png)

> La courbe orange, appelée courbe effort-vitesse du matériel, représente l'effort moteur maximal en fonction de la
> vitesse de circulation.
>
> La longueur, la masse, et la vitesse max du train sont représentées en bas de l'encadré.

- **L'horaire de départ** permettant ensuite de calculer les horaires de passage aux différents points remarquables (dont gares).

- **Les marges :** Temps ajouté au trajet du train pour détendre sa marche (voir [page sur les marges](./allowances)).

![Marge](marges.png)

- **Le pas de temps** pour le calcul de [l'intégration numérique](./numerical_integration).

#### 2 - Les résultats

Les résultats d'un calcul de marche peuvent se représenter sous différentes formes :

- **Le graphique espace/temps (GET) :** représente le parcours des trains dans l'espace et dans le temps, sous la forme de traits globalement diagonaux dont la pente est la vitesse. Les arrêts apparaissent sous la forme de plateaux horizontaux.

![Graphique Espace/Temps](graph_espace_temps.jpg)

> Exemple de GET avec plusieurs trains espacés d'environ 30mn.
>
> L’axe **x** est l’horaire de passage du train, l’axe **y** est la position du train en [m].
>
> La ligne bleue représente le calcul de marche le plus tendu pour le train, la ligne verte représente un calcul de marche détendu, dit « économique ».
>
> Les rectangles pleins entourant les trajets représentent les portions de la voie successivement reservées au passage du train (appelées cantons).

- **Le graphique espace/vitesse (GEV) :** représente le parcours d'un seul train, cette fois-ci en termes de vitesse. Les arrêts apparaissent donc sous forme de décrochages de la courbe jusqu'à zéro, suivis d'un réaccélération.

![Graphique Espace/Vitesse](graph_espace_vitesse.png)

> L’axe **x** est la position du train en [m], l’axe **y** est la vitesse du train en [km/h] .
>
> La ligne violette représente la vitesse maximale autorisée.
>
> La ligne bleue représente la vitesse dans le cas du calcul de marche le plus tendu.
>
> La ligne verte représente la vitesse dans le cas du calcul de marche « économique ».

- **Les horaires de passage du train aux différents points remarquables**

![Horaire de départ](timetables.png?style=time)

<style>
img[src$="time"] {
  height: 70%;
  width: 70%;
}
</style>
