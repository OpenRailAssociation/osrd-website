---
title: "Parcours de l'infrastructure"
linkTitle: "1 - Parcours de l'infrastructure"
weight: 10
---

La première chose à définir est *comment un train se déplace sur l'infrastructure*,
sans prendre en compte les conflits pour l'instant.

On a besoin d'une manière de définir et d'énumérer les différents chemins
possibles et de parcourir l'infrastructure, avec plusieurs contraintes :
1. Le chemin doit être compatible avec le matériel roulant donné
   (électrification, gabarit, systèmes de signalisation)
2. À n'importe quel point, on doit être en mesure d'accéder aux propriétés
   du chemin depuis le point de départ jusqu'au point considéré.
   Cela inclus les routes et les cantons.
3. Dans certains cas, on doit savoir où le train ira *après*
   le point actuellement évalué (pour une détection de conflits correcte).


Pour répondre à ce besoin, une classe `InfraExplorer` a été implémentée.
Elle utilise les cantons (section de signal en signal) comme subdivision
principale.
Elle est composée de 3 sections : le canton courant, les prédécesseurs,
et les cantons suivants.


![InfraExplorer structure](infra_explorer.svg)

Dans cet exemple, les flèches vertes sont les cantons précédents.
Ce qui se produit dessus est considéré comme immuable.

La flèche rouge est le canton actuellement exploré.
C'est à cet endroit que les simulations du train et de la
signalisation sont effectuées, et que les conflits
sont évités.

Les flèches bleues sont les cantons suivants. Cette section
n'est pas encore simulée, elle existe seulement pour savoir
où le train ira ensuite. Dans cet exemple, elle indique
que le signal en bas à droite peut être ignoré, seul
le chemin du haut sera utilisé.
Le chemin du bas sera évalué dans une autre instance de
`InfraExplorer`.

Plus de détails sur la classe et son interface sont
présents sur la version anglaise de la page.
