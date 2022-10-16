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

Un conflit est un événement qui peut forcer un train à ralentir:
 - un délai de formation d'itinéraire dû à l'indisponibilité de ressources
 - un conflit d'espacement dû à un rattrapage

Pour détecter les conflits, il est nécessaire de calculer l'impact qu'a un train sur la disponibilité des ressources: son empreinte.

### Conflits de routage

Le routage d'un train à travers l'infrastructure a un impact susceptible de générer des conflits.
L'empreinte de routage, sont les réservations de ressources requises pour qu'un train puisse être aiguillé sans gêne jusqu'à sa destination.
Concrètement, ces ressources correspondent à des réservations de zones dans le temps.

Ces temps de réservation de ressources sont obtenus selon l'algorithme suivant:
 - un planning d'établissement des ressources est établi de telle sorte à ce que le train n'est jamais forcé de ralentir par une commande trop tardive des routes. Ce planning d'établissement est déterminé en calculant les moments à partir duquel le conducteur verrait une signalisation contraignante, puis en soustrayant marge de temps (Phi, en jargon SNCF).
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
 - on commence par partir du principe que toute les zones réservées pour routage le sont également pour espacement
 - à chaque fois que le conducteur voit un signal non-contraignant, la dernière zone actuellement réservée pour le train est occupée: si la signalisation ne contraint toujours pas le train, alors cette zone est marquée comme partageable à cet instant, et la zone précédente est testée. Si la signalisation contraint le train, on passe au signal suivant.
 - la chronologie de réservation de zone pour espacement est recoupée pour tous les trains, et comparée avec l'occupation des zones. Chaque intersection génère un conflit.

{{% pageinfo color="info" %}}
Le système de réservation pour espacement a plusieurs avantages majeurs :
 - il permet de simuler le partage de l'infrastructure par des trains qui utilisent des systèmes de signalisation différents
 - il peut être étendu aux blocs mobiles: au lieu de réserver des zones devant le train, on réserve une distance
{{% /pageinfo %}}
