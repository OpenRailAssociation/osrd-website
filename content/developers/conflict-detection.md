---
title: "Détection de conflit"
linkTitle: "Détection de conflit"
weight: 45
---

{{% pageinfo color="warning" %}}
Ce document n'est pas finalisé
{{% /pageinfo %}}

<script type="application/javascript" src="../mkt.js"></script>
<object onload="mkt_hydrate(this.contentDocument.rootElement)" type="image/svg+xml" data="../space-time-diagram.svg">
</object>

## Introduction

Le système de détection de conflit se repose sur le poste d'aiguillage et la simulation de la signalisation pour synthétiser les besoins en ressources des acteurs, et détecter les incompatibilités.

Le système de détection de conflit doit permettre :
 - étant donné deux simulations indépendantes, déterminer si elles peuvent être rejouées en même temps sans conflit
 - avoir des résultats interprétables, c'est à dire que les conflits produits doivent pouvoir être reliés à un processus métier
 - avoir un fonctionnement interprétable, c'est à dire qu'il doit être possible de visualiser et interprêter le fonctionnement du système
 - passer à l'échelle : étant donné un grand ensemble de trains et leur utilisation de ressources, il doit toujours être possible de détecter leurs conflits en un temps raisonnable
 - de permettre la recherche de chemin à travers les ressources utilisées par un grand nombre de trains
 - de modéliser les conflits d'espacements transmits par des systèmes de signalisation à bloc fixe

Un certain nombre de contraintes guident et ont guidé la conception du système de détection de conflit :
 - **il ne doit pas pouvoir aboutir à la génération de faux-négatifs**: s'il ne détecte pas de conflits, une simulation multi-train de la même grille horaire ne doit pas présenter de ralentissements
 - le modèle ne doit pas se reposer sur des informations difficiles à obtenir étant donné l'état actuel du projet
 - il ne doit pas exclure l'inclusion ultérieure de bloc mobile
 - il doit être possible de détecter les conflits en simulant la signalisation tel que prévu dans le modèle de simulation
 - il doit être possible de détecter les conflits dans des zones à signalisation hétérogène, voire superposée

## Théorie des conflits

Ce modèle définit les règles de fonctionnnement du système de détection de conflit.

Il repose sur un système de réservation de ressources abstraites.
Ces ressources ont des configurations possibles, et peuvent être réservées pour un laps de temps donné.
Si des réservations requièrent une ressource au même moment, elle peuvent où non cohabiter selon leur type et paramètres.
Si deux réservations simultanées ne peux pas cohabiter, c'est un conflit.

### Définitions

#### Acteur

Un acteur est une entité susceptible de requérir des ressources

#### Ressource

Une ressource est un objet susceptible d'être requis et utilisé par différents acteurs.
Chaque ressource a des configurations, et ne peut être que dans une configuration à un instant donné.

#### Besoin

Un besoin est l'expression par un acteur de son besoin d'utilisation d'une ressource pour une période de temps donnée.

Ces besoins peuvent prendre plusieurs formes :
 - **partageables** : la ressource est requise dans une configuration donnée, pendant le laps de temps donné. Ce type de besoin peut seulement cohabiter avec d'autres besions partageables de la même configuration.
 - **exclusifs** : la ressource est requise dans une configuration donnée, pour un acteur particulier, pendant le laps de temps donné. Ce type de besoin peut seulement cohabiter avec d'autres du même acteur et de la même configuration.

#### Conflit

##### Conflits de besoin

Un conflit de besoin se produit lorsque qu'il existe deux besoins simultanées dont les contraintes sont incompatibles.

Par exemple, il y a un conflit lorsque:
 - un besoin exclusif chevauche n'importe quelle autre réservation d'un autre acteur
 - un besoin partageable chevauche un besoin d'une autre configuration

Il n'y a toutefois pas de conflit lorsque:
 - une ressource est requise de manière exclusive sur des périodes qui n'ont pas de moment commun
 - une ressource est partagée par des besoins qui ne requièrent pas la même configuration

Un conflit de ressource perturbe l'acteur à l'origine des réservations.

##### Conflits de changement de configuration

Certains conflits se produisent par manque de temps entre deux réservations consécutives.
Le temps requis entre deux réservations est spécifique à chaque ressource.

## Application au modèle de détection de conflit

Le système de détection de conflit peut être appliqué de différentes manières

### Définitions

#### Acteur

On distingue les types d'acteurs suivants :
 - les **trains** (ou un poste d'aiguillage / régulateur agissant au nom d'un train)
 - les **zones de travaux**

#### Ressource

On distingue les ressources suivantes :
 - les **zones**, qui ont autant de configurations qu'il y a de manières de les traverser
 - les **aiguilles**, qui ont autant de configurations qu'elles ont de position

{{% pageinfo color="info" %}}
À l'avenir, les quais pourraient également être modélisés comme ressources, ce qui permettrait de générer des conflits en cas d'embarquement ou débarquement simultané
{{% /pageinfo %}}

#### Réservation

Une réservation, c'est quelque chose qui enlève de la capacité.

#### Conflit

En pratique, un conflit de ressource gêne l'acteur à l'origine des réservations est un événement qui peut forcer un train à ralentir :
 - un délai de formation d'itinéraire dû à l'indisponibilité de ressources
 - un conflit d'espacement dû à un rattrapage

Pour détecter les conflits, il est nécessaire de calculer l'impact qu'a un train sur la disponibilité des ressources: son empreinte.

#### Capacité

Le terme capacité désigne la capacité à réserver une ressource, ou plus largement la capacité de réservation d'un ensemble de ressources nécessaires au passage d'un train.

## Génération des réservations

**L'enjeu principal est de générer des réservations qui, si elles sont satisfaites, garantissent au train simulé, suivant la signalisation simulée, un trajet sans ralentissement.**

### Conflits d'itinéraire

L'aiguillage d'un train à travers l'infrastructure a un impact susceptible de générer des conflits.
Un conflit se produit lorsqu'un conducteur perçoit les conséquences du fait qu'un itinéraire a été établi trop tardivement.
L'empreinte d'aiguillage, c'est les réservations de ressources requises pour qu'un train puisse être aiguillé sans gêne jusqu'à sa destination.
Concrètement, ces ressources correspondent à des réservations de zones dans le temps.

Ces temps de réservation de ressources sont obtenus selon l'algorithme suivant:
 - un planning d'établissement des ressources est établi de telle sorte à ce que le train n'est jamais forcé de ralentir par une commande trop tardive des routes. Ce planning d'établissement est déterminé en calculant les moments à partir duquel le conducteur verrait une signalisation contraignante, puis en soustrayant marge de temps
 - le planning d'établissement des routes de tous les trains est utilisé pour déterminer la chronologie combinée de fin d'utilisation des zones et des aiguilles
 - la chronologie combinée de fin d'utilisation des zones est utilisée pour calculer les temps de formation des routes, puis un planning de commande des routes
 - le planning de commande des routes permet de connaître la chronologie de début d'utilisation des zones, et donc connaître les réservations de zones pour chaque train

On peut ensuite superposer les réservations de zones, et traduire en conflit les réservations incompatibles.

### Conflits d'espacement

En plus de pouvoir être ralentis par l'établissement trop tardif de leurs routes, les trains peuvent être également être ralentis par la présence d'un train plus loin sur leur chemin.
Tout comme les conflits de routes sont détectés en recoupant la chronologie de réservation des zones par les routes, les conflits d'espacement sont détectés en recoupant les réservations implicites de zones pour l'espacement.
Des zones sont réservées pour espacement lorsqu'elles ne peuvent être occupées sous peine de ralentissement.
En fait, les zones réservées par un train peuvent être classifiées comme partageables, ou réservées pour espacement.

Les réservations implicites de zones sont calculées en simulant la signalisation comme suit:
 - le planning de commande des routes est rejoué
 - on commence par partir du principe que toute les zones réservées pour l'aiguillage le sont également pour espacement
 - à chaque fois que le conducteur voit un signal non-contraignant, la dernière zone actuellement réservée pour le train est occupée: si la signalisation ne contraint toujours pas le train, alors cette zone est marquée comme partageable à cet instant, et la zone précédente est testée. Si la signalisation contraint le train, on passe au signal suivant.
 - la chronologie de réservation de zone pour espacement est recoupée pour tous les trains, et comparée avec l'occupation des zones. Chaque intersection génère un conflit.

{{% pageinfo color="info" %}}
Le système de réservation pour espacement a plusieurs avantages majeurs :
 - il permet de simuler le partage de l'infrastructure par des trains qui utilisent des systèmes de signalisation différents
 - il peut être étendu aux blocs mobiles: au lieu de réserver des zones devant le train, on réserve une distance
{{% /pageinfo %}}
