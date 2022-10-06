---
title: "Espacement"
linkTitle: "Espacement"
weight: 50
description: "Gère l'état des cantons"
---

## Couche de cantonnement

Les cantons sont l'équivalent des routes, mais pour la signalisation: les routes autorisent le déplacement du train, et les cantons, qui se superposent aux routes, permettent au train d'être mis au courant de ses mouvements autorisés.

Les cantons ont plusieurs attributs:
 - un **chemin**, qui représente les zones protégées par le canton, et leur état attendu (au même format que le chemin des routes)
 - un **signal d'entrée**, optionnel (quand le canton pars d'un butoir)
 - des **signaux intermédiaires** éventuels (c'est utilisé avec des systèmes du style BAPR)
 - un **signal de sortie**, optionnel (quand le canton se termine à un butoir)

Le chemin est exprimé de détecteur en détecteur afin de pouvoir faire un rapprochement avec le graphe des routes.

Quelques remarques:
- il peut y avoir plusieurs systèmes de signalisation superposés sur la même infrastructure. le modèle pars du principe qu'un seul système à la fois est actif
- un canton n'a pas d'état: on peut se reposer sur l'état dynamique des zones qui le compose
- les signaux utilisent les cantons pour savoir quelles zones sont à protéger à un instant donné

## Exigences de conception

- chaque signal doit connaître le **prochain signal compatible**
- chaque signal doit connaître les **zones qu'il protège**
- **compatibilité modules signalisation** : les modules doivent créer les cantons entre chaque signaux. Chaque canton a un système de signalisation associé.
- **compatibilité pathfinding** : Le pathfinding se fait dans le produit du graphe de routage et du graphe de cantons.

## Dépendances

- `statique` les zones protégées par le canton, et leur configuration attendue (ce qui inclus l'état des éléments mobiles)
- `statique` les signaux de début et de fin (optionnels)

## Opérations

- **signalisation**: étant donné une direction sur un détecteur, quel est le canton actif, s'il y en a un
- **signalisation**: quel est le signal suivant dans la chaîne
- **signalisation**: quelles sont les zones protégées par le signal
