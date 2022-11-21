---
title: "Signalisation"
linkTitle: "Signalisation"
weight: 60
description: "Gère l'état des signaux"
---

## Description

La couche de signalisation comprend l'ensemble des signaux, qui réagissent au cantonnement et à la réservation.
Les signaux peuvent être de différent types, et sont chargés de manière modulaire. Seul importe leur comportement
vis-à-vis de l'état de l'infrastructure, et la réaction des trains à la signalisation.

Les signaux sont reliés entre eux par des cantons. Les cantons définissent les mouvements autorisés par la signalisation.

## Conception

### Exigences de conception

- chaque signal doit connaître le **prochain signal compatible**
- chaque signal doit connaître les **zones qu'il protège**
- **compatibilité pathfinding** : Le pathfinding se fait dans le produit du graphe de routage et du graphe de cantons.
- fournir aux modules de signalisation le **minimum d'information nécessaire** à leur fonctionnement
- pouvoir utiliser un module de signalisation sans avoir à instancier une simulation complète
- pouvoir avoir des modules qu'on puisse charger dans un ordre indépendant

### Questions de recherche

- est-ce qu'il existe des cantons qui chevauchent une fin de route ? non (loic)
- est-ce qu'il existe des existe des signaux LL(2) ? non en france
- est-ce qu'il existe des signaux qui changent de comportement en fonction du canton actif devant eux ? oui, pour les ralentissements
- est-ce qu'il existe des signaux qui sont le départ de cantons de types différents (bal3 et bapr par exemple) ? OUI LOL, tvm meme
- est-ce que le comportement d'un signal peut déprendre de quel canton est actif après le signal de fin du canton actuel ? oui, avec les ralentissements ou jaune cli

- est-ce que certains de signalisation ont besoin d'avoir des informations supplémentaires dans les cantons ? mouais, y'a des ralentissements, mais c'est pas spécialement porté par le canton
- est-il nominal qu'un train aie plusieurs systèmes de signalisation actifs simultanément ? non

- quand et par qui les cantons sont-ils générés ?
- quelles sont les données nécessaires à la génération des cantons ?

### Présupposés

- les signaux ont une liste de types
- les cantons ont un type
- il est possible de déterminer étant donné le seul signal, ses propriétés de cantonnement
- il n'existe pas de cantons qui chevauchent une fin ou un début de route
- les cantons qui ne sont pas couverts par des routes n'existent pas ou peuvent être ignorés
- un train n'utilise qu'un seul système de signalisation à la fois

## Design des cantons

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

## Design des signaux

Chaque signal physique peut porter plusieurs signaux logiques.

Chaque signal logique a pour information statique :
 - un type (`bal3toTVM`)
 - des paramètres spécifiques au type (`Nf`, `ralen30`)

Le chargement se fait en deux partie : les signaux sont d'abord chargés, puis initialisés.

Une fois chargés, les signaux logiques exposent :
 - un système de signalisation (`bal3`)
 - des propriétés spécifiques au système de signalisation
 - des propriétés de cantonnement : 1) est-il délimiteurs de canton ? si oui, quel type de canton et aval et en amont. 2) est-il contenu dans un canton

L'initialisation permet aux signaux de :
 - découvrir les autres cantons et signaux adjacents
 - signaler des configurations invalides

### Cycle de vie des signaux

Au chargement de l'infrastructure :
 - les signaux sont chargés par les modules
 - le framework crée des cantons entre les signaux en suivant les routes présentes dans l'infrastructure, et les propriétés de cantonnement des signaux
 - des vérifications sont faites sur le graphe de cantons créé : il doit toujours pouvoir être possible de choisir un canton pour chaque signal et chaque état de l'infrastructure
 - le module de signalisation initialise les signaux, et a accès aux cantons créés au préalable

Avant le départ d'un train:
 - le chemin d'un train peut être exprimé soit en routes soit en cantons. Ces deux chemins doivent être superposés
 - la file de signaux que le train va rencontrer est établie

Lors de la simulation :
 - au fil du déplacement du train, les informations d'occupation des voies devant lui sont synthétisées
 - lorsqu'un train observe un signal, son état est évalué : en fonction du canton actif

### État

Chaque système de signalisation a son type d'état de signal.

Étant donné un type de signal, il doit être possible de :

- savoir s'il est contraignant à cause d'une MA réduite
- déterminer une représentation graphique de ce signal
- **TODO**: il devra être possible de faire réagit un train à ce signal


### Évalution de l'état des signaux

Les signaux sont modélisés comme une fonction d'évaluation, qui consomme les paramètres pouvant influencer son comportement, et retourne l'état actuel du signal.
é
Il est nécessaire de choisir quelle forme prennent les paramètres :
 - une liste de paramètres, annotés de manière à pouvoir être injectés
   - `avantage` permet d'obtenir une description complète des paramètres de chaque signal
   - `désavantage` permet difficilement de faire varier le comportement du signal en fonction du canton actif
 - un seul paramètre, qui fournit une vue permettant à la fonction d'évaluation de requêter les paramètres nécessaires
   - `avantage` plus simple d'implémentation que la première méthode
   - `désavantage` les signaux ont accès à une plus large surface d'API, ce qui peut rendre plus difficile les changements ultérieurs

La vue est choisie pour le moment, car plus flexible.

```rust
fn signal(world: SignalWorldView) -> Bal3Aspect {
    // ...
}
```

La vue doit permettre d'accéder aux données suivantes :
 - une synthèse de l'état des zones en aval jusqu'à la MA du train
 - la chaine de cantons
 - l'état des signaux en aval présents dans la chaine de cantons du train

#### Chemin de la vue signalisation

Le chemin de la vue signalisation est exprimé en cantons :
 - des cantons peuvent être rajouter pour étendre la vue
 - la vue peut être réduite en supprimant des cantons

#### Simulation hors chemin du train

Il est possible de simuler la signalisation hors du chemin du train :
 - si un signal donne sur des cantons empruntant des chemins différents, il est simulé comme s'il était en bout d'itinéraire, et sera donc au carré
 - si un signal donne sur des cantons empruntant le même chemin, il est simulé avec les autres signaux de la suite, dans une vue construite à cet effet

## Dépendances

- `statique` graphe des routes, pour pouvoir créer des cantons
- `statique` les signaux, leur type et détecteur + direction associé
- `statique` les propriétés de cantonnement pour chaque signal
- `dynamique` observer l'**état des zones**

## Opérations

- **instancier une vue** crée un cadre dans lequel observer des signaux
- **prévoir le chemin** signaler à la vue les cantons qui seront empruntés par le train
- **observer un signal** s'abonner à l'état d'un signal (via la vue)
- **dépasser un signal** signaler qu'un signal a été dépassé par le train (via la vue)
