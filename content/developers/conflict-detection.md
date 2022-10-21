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

## Définitions

### Acteur

#### Formelle
Un acteur est une entité susceptible de réserver des ressources

#### Ferroviaire
On distingue les types d'acteurs suivants:
 - les trains (ou un poste d'aiguillage / régulateur agissant au nom d'un train)
 - les zones de travaux

### Ressource

#### Formelle
Ici, une ressource est un objet susceptible d'être réservé et utilisé par différents acteurs.
Les ressource peuvent avoir des configurations, qui restraignent la capacité des acteurs à réserver ces ressources au même moment.

#### Ferroviaire
Pour le moment, il n'y a qu'un type de ressource : les zones.
Les zones ont autant de configurations qu'il existe de manières de les traverser.

{{% pageinfo color="info" %}}
À l'avenir, les quais pourraient également être modélisés comme ressources, ce qui permettrait de générer des conflits en cas d'embarquement ou débarquement simultané
{{% /pageinfo %}}

### Réservation

#### Formelle
Une réservation est l'expression par un acteur du besoin d'utilisation d'une ressource pour une période de temps donnée.

Dans le cas général, ces réservations peuvent prendre plusieurs formes:
 - **exclusive**: la ressource ne **peut pas être partagée** pendant le laps de temps donné
 - **partagée**: la ressource peut satisfaire plusieurs réservations partagées en même temps
 - **partagée sous condition**: la ressource peut satisfaire plusieurs réservations partagées en même temps, du moment que ces réservations répondent à un critère commun

#### Ferroviaire
Une réservation, c'est quelque chose qui enlève de la capacité.

### Conflit

#### Formelle
Un conflit se produit lorsque qu'il existe deux réservations dont les contraintes sont incompatibles.

Par exemple, il y a un conflit lorsque:
 - une réservation exclusive chevauche n'importe quelle autre réservation
 - une réservation partagée sous condition chevauche une réservation incompatible

Il n'y a pas de conflit lorsque:
 - une ressource est réservée de manière exclusive sur des périodes qui n'ont pas de moment commun
 - une ressource est partagée sous condition par des réservations qui respectent leur critère commun

Un conflit de ressource perturbe l'acteur à l'origine des réservations.

#### Ferroviaire
En pratique, un conflit de ressource gêne l'acteur à l'origine des réservations est un événement qui peut forcer un train à ralentir :
 - un délai de formation d'itinéraire dû à l'indisponibilité de ressources
 - un conflit d'espacement dû à un rattrapage

Pour détecter les conflits, il est nécessaire de calculer l'impact qu'a un train sur la disponibilité des ressources: son empreinte.

### Capacité

Le terme capacité désigne ici la capacité de réservation d'une ressource, ou plus largement la capacité de réservation d'un ensemble de ressources nécessaires au passage d'un train.

## Génération des réservations

**L'enjeu principal est de générer des réservations qui, si elles sont satisfaites, garantissent au train simulé, suivant la signalisation simulée, un trajet sans encombre.**

### Conflits d'itinéraire

L'aiguillage d'un train à travers l'infrastructure a un impact susceptible de générer des conflits.
L'empreinte d'aiguillage, c'est les réservations de ressources requises pour qu'un train puisse être aiguillé sans gêne jusqu'à sa destination.
Concrètement, ces ressources correspondent à des réservations de zones dans le temps.

Ces temps de réservation de ressources sont obtenus selon l'algorithme suivant:
 - un planning d'établissement des ressources est établi de telle sorte à ce que le train n'est jamais forcé de ralentir par une commande trop tardive des routes. Ce planning d'établissement est déterminé en calculant les moments à partir duquel le conducteur verrait une signalisation contraignante, puis en soustrayant marge de temps (Khi, en jargon SNCF).
 - le planning d'établissement des routes de tous les trains est utilisé pour déterminer la chronologie combinée de fin d'utilisation des zones, et donc des aiguilles
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
