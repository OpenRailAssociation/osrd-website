---
title: "OSRD au Dreiländer Hack à Vienne"
linkTitle: "OSRD au Dreiländer Hack à Vienne"
date: 2023-07-19
---

## Le Dreiländer hack, le rendez-vous des entreprises ferroviaires germanophones... mais pas que !

Les 29 et 30 juin derniers s'est tenu à Vienne (Autriche) le [Dreiländer hack](https://bcc.oebb.at/de/das-leisten-wir/innovationen/dreilaenderhack) (le hackathon des trois pays). Organisé par Deutsche Bahn - DB (Allemagne), Österreichische Bundesbahnen - ÖBB (Autriche) et Schweizerische Bundesbahnen - SBB (Suisse), c'est un rendez-vous annuel dédié à la collaboration sur des problématiques ferroviaires communes.

Nous avons eu le plaisir d'être invité·es à participer dans le cadre de la fondation [OpenRail](https://openrailfoundation.org/), et le thème de cette année étant "Open Railways" il aurait été difficile de refuser !

## 24h pour travailler ensemble sur un sujet d'intérêt commun

Les 150 participant·es se sont réparti·es en 16 groupes de travail sur des thèmes très variés tels que :

* Imaginer une interface simple de commande de sillons (un sujet important pour l'avenir d'OSRD) ;
* Proposer de l'information voyageur adaptée aux différents handicaps ;
* Optimiser la priorisation des trains aux embranchements en fonction de l'affluence à bord et à quai (projet Motis) ;
* Identifier automatiquement des trains au garage qui consomment de l'énergie ;
* Calculer des dates de maintenance prévisionnelles à partir d'une base de données historique sur chaque composant du train ;
* Détecter des erreurs de mesure de vitesse et de positionnement GPS sur des trains d'inspection des voies ;
* Optimiser les chantiers de maintenance pour limiter la capacité perdue ;
* Faciliter l'information voyageurs avec un chatbot GPT ;
* Imaginer une interface de visualisation & de commande pour l'offre de trains de nuit au niveau européen facile à utiliser.

## Le challenge proposé par OSRD

Le challenge proposé par OSRD visait à consolider les données ferroviaires présentes dans OpenStreetMap, une base de données ouverte & collaborative que nous utilisons comme source pour l'infrastructure ferroviaire en Europe.

L'objectif était de développer un algorithme permettant d'identifier 5 types d'erreurs probables dans les données :


### Voies proches géographiquement mais non connectées topologiquement
<img src="illustrate-disconnected.webp" alt="Un train jouet où les voies en bois sont séparées par un espace"/>

### Aiguilles à plus de 3 branches
<img src="illustrate-switches.webp" alt="Un train où une voie supplémentaire a été ajoutée à une aiguille"/>

### Gares éloignées des voies
<img src="illustrate-stations.webp" alt="Un train jouet sur des rails en bois et une gare dessinée sur un post-it. Un point d'interrogation est dessiné entre les deux."/>

### Voies avec des angles trop importants
<img src="illustrate-angles.webp" alt="Un train jouet où les voies en bois forment un angle à 60°"/>

### Information d'écartement des voies manquante
<img src="illustrate-gauge.webp" alt="Un train jouet en bois. Une règle à mesurer est posée sur les voies, avec un post-it avec un point d'interrogation."/>

Le sujet a eu du succès et nous avons formé une équipe de 10 personnes réparties entre les quatre entreprises participantes. Après une présentation du challenge & du modèle de données d'OpenStreetMap, nous avons recherché des outils existant et avons choisi de nous appuyer sur [Osmose](https://osmose.openstreetmap.fr/), une application open source de détection et d'affichage d'erreurs potentielles dans OSM. Nous nous sommes ensuite réparti·es sur les 5 types d'erreurs.

<img src="team.webp" alt="Les 10 membres de l'équipe posent devant une paroi de container décorée où il est écrit “Es ist möglich.”"/>

*De gauche à droite : Christoph (DB), Klara (ÖBB), Frederik (SBB), Carl (SBB), Julius (DB), Jennifer (DB), Daniel (ÖBB), Céline (SNCF), Max (DB), Tristram (SNCF).*

## Les résultats

Après 24h de travail le résultat est une [carte interactive permettant d'afficher les différentes erreurs](https://openrailfoundation.github.io/FixOurRail-weird-angles/) (cliquez sur les pictogrammes pour afficher le détail des erreurs).
Vous pouvez retrouver tout le code qui a été produit sur le [GitHub de la fondation Open Rail](https://github.com/OpenRailFoundation/FixOurRail-simple-solutions).

Le manque de temps imparti ne nous a malheureusement pas permis d’intégrer nos analyseurs dans Osmose, cependant cela reste notre priorité pour faire avancer les travaux des contributeurs et contributrices d'OpenStreetMap sur les données ferroviaires !
