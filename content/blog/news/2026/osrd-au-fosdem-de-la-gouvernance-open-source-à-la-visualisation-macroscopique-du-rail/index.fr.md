---
title: "OSRD au FOSDEM : de la gouvernance open source à la visualisation
  macroscopique du rail "
date: 2026-02-20T09:57:00.000+01:00
---
Le **FOSDEM** (Free and Open Source Developers’ European Meeting) est l’un des événements majeurs en Europe consacrés au **logiciel libre et open source**. Il se tient chaque année à l'**Université libre de Bruxelles** et rassemble plusieurs milliers de développeur·euses, contributeur·ices, étudiant·es et passionné·es du monde entier. 

L’édition 2025 s’est déroulée les 01 & 02 février.

# **Retour sur la participation d’OSRD en 2024** 

OSRD avait déjà été présenté lors de l’édition 2024, à travers trois interventions réparties dans deux devrooms : 

## **📌 *Public Code and Digital Public Goods*** 

* **Titre** : *Open Source Railway Designer (OSRD): why SNCF Réseau start an open source project?* 
* **Orateur** : Loïc Hamelin (Program Manager OSRD, SNCF Réseau) 
* **Date** : Samedi 3 février 2024 
* **Résumé** : La conférence portait sur les raisons qui ont poussé SNCF Réseau à initier OSRD, un projet open source visant à moderniser la planification et la simulation des infrastructures ferroviaires. 

***Railways and Open Transport*** 

* **MARECO algorithm: how to drive a train using the least amount of energy** 
* Orateur : Alex Rolland (Product Owner OSRD) 
* Présentation de l’algorithme MARECO, intégré à OSRD, qui optimise la conduite des trains en réduisant leur consommation d’énergie. 
* **Strip Map: a cartographic representation of a travel plan** 
* Orateur : Alexis Jacomy (Contributeur OSRD, OuestWare) 
* Démonstration d’une fonctionnalité de visualisation cartographique condensée des plans de voyage dans OSRD. 

# **OSRD au FOSDEM 2025 : zoom sur la visualisation macroscopique** 

Pour cette édition 2025, OSRD est revenu dans la devroom *Railways and Open Transport* avec une présentation dédiée à l’intégration de l’éditeur graphique NGE : 

## **Enhancing OSRD with NGE’s Macroscopic Visualization** 

* **Orateur** : Louis Greiner 
* **Date** : Dimanche 2 février 2025 à 14h20 
* **Devroom** : Railways and Open Transport 
* **Salle** : K.4.601 
* **Durée** : 20 minutes 
* 📺 [Voir la vidéo de la présentation](https://fosdem.org/2025/schedule/event/fosdem-2025-5221-enhancing-osrd-with-nge-s-macroscopic-visualization/) 
* 📄 [Consulter les slides (PDF)](https://fosdem.org/2025/events/attachments/fosdem-2025-5221-enhancing-osrd-with-nge-s-macroscopic-visualization/slides/238716/enhancing_yidZKMU.pdf) 

Cette intervention suivait immédiatement celle des Chemins de fer fédéraux suisses (SBB), également autour d’un projet OpenRail, illustrant une dynamique de coopération européenne. Deux présentations, un objectif commun : rendre les outils ferroviaires open source plus puissants et interopérables. 

## **NGE, un outil suisse au service de la visualisation ferroviaire** 

NetzGrafik-Editor (NGE) est un éditeur graphique développé par la SBB. Il permet une représentation interactive, claire et à grande échelle des réseaux ferroviaires (gares, flux, liaisons, horaires), pour accompagner la planification stratégique. 

Architecture technique : 

* Front-end : application web Angular + D3.js 
* Back-end : service Java avec PostgreSQL, pour le traitement et le stockage des données réseau 

**Pourquoi intégrer NGE dans OSRD ?** 

OSRD avait besoin d’une visualisation macroscopique puissante, sans complexifier son architecture légère (Rust, Python, React). L’intégration de NGE s’est donc faite en mode “standalone".

Ce choix permet : 

* De réutiliser une brique existante et robuste 
* De préserver la légèreté et la modularité d’OSRD 
* De favoriser l’interopérabilité et la collaboration open source entre SBB et SNCF 

📘 Pour en savoir plus : [documentation OSRD sur NGE](https://osrd.fr/en/docs/explanation/netzgrafik-editor/) 

## Comment l’intégration a-t-elle été réalisée ? 

Voici les **étapes clés** de l’intégration de NGE dans OSRD : 

**1. Définir les contraintes** 

* Préserver la maintenabilité de NGE côté SBB 
* Identifier précisément les besoins côté OSRD 
* Concevoir une architecture modulaire, évolutive et non intrusive 

**2. Mettre en place un mode *standalone*** 

* Découpler le front-end Angular/D3.js de son back-end 
* Faire tourner NGE de façon isolée, sans dépendance serveur 

**3. Encapsuler NGE dans un Web Component** 

* Créer un élément HTML personnalisé
* L’intégrer dans l’interface OSRD

**4. Transmettre les données depuis OSRD** 

* Générer un objet netzgrafikDto à partir des données OSRD 
* Le passer en paramètre à NGE via l’attribut @Input 

**5. Gérer les interactions utilisateur** 

* Capturer les événements (@Output) exposés par NGE 
* Les convertir en mises à jour métiers côté OSRD 

**6. Synchronisation bidirectionnelle** 

* Traduire les événements utilisateur en actions OSRD 
* Réinjecter les résultats OSRD dans le graphe NGE 

**7. Orchestration du développement** 

* Utiliser **Docker** pour exécuter les deux outils en parallèle 
* Publier le composant comme **package NPM** pour faciliter le partage et la maintenance 

## Ce travail conjoint entre SBB et SNCF Réseau illustre les bénéfices concrets de l’open source : 

✅ Mutualisation de composants éprouvés 

✅ Internationalisation (français, anglais, allemand, italien) 

✅ Matrices origine-destination intégrées 

✅ Contributions croisées via GitHub (bugs, i18n, nouvelles fonctionnalités) 

**Et maintenant ?** 

OSRD poursuit : 

* L’enrichissement de ses fonctionnalités 
* L’amélioration continue de l’intégration NGE 
* Sa participation au DreiLänderHack, un hackathon transfrontalier dédié aux données de transport ferroviaire 

Cette dynamique européenne et ouverte permet d’accélérer le développement d’un écosystème ferroviaire plus agile, interopérable et collaboratif.
