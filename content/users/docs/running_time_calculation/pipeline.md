---
title: "Le processus de calcul de marche"
linkTitle: "4 - Le processus de calcul de marche"
weight: 40
---

Le calcul de marche dans OSRD est un processus à 4 étapes, utilisant chacune [le système d'enveloppes](../envelopes_system) :

1. [Construction du profil de vitesse le plus restrictif](#calcul-du-most-restricted-speed-profile-mrsp)
2. [Ajout des différentes courbes de freinage](#calcul-du-max-speed-profile)
3. [Ajout des différentes courbes d'accélération et vérification des courbes de vitesse constante](#calcul-du-max-effort-profile)
4. [Application de marge(s)](#application-de-marges)

<font color=#aa026d>

### Calcul du Most Restricted Speed Profile (MRSP)

</font>

Une première enveloppe est calculée au début de la simulation en regroupant toutes les limites de vitesse statiques :

- vitesse maximale de la ligne
- vitesse maximale du matériel roulant
- limitations temporaires de vitesse (en cas de travaux sur une ligne par exemple)
- limitations de vitesse par catégorie de train
- limitations de vitesse selon la charge du train
- limitations de vitesse correspondant à des panneaux de signalisation

La longueur du train est également prise en compte pour s'assurer que le train n'accélère qu'une fois sa queue ayant quitté la zone de plus faible vitesse. Un décalage est alors appliqué à la courbe en pointillée rouge. L'enveloppe résultante (courbe noire) est appelée **Most Restricted Speed Profile (MRSP)** correspondant donc au profil de vitesse le plus restrictif. C'est sur cette enveloppe que seront calculées les étapes suivantes.

![Most Restricted Speed Profile](../mrsp.png)

> La ligne pointillée rouge représente la vitesse maximale autorisée en fonction de la position.
> La ligne noire représente le MRSP où la longueur du train a été prise en compte.

Il est à noter que les différentes envelopeParts composant le MRSP sont des données d'entrée, elles ne correspondent donc pas à des courbes avec une réalité physique.

<font color=#aa026d>

### Calcul du Max Speed Profile

</font>

En partant du MRSP, toutes les courbes de freinage sont calculées grâce au système d'overlay (voir [ici](../envelopes_system/#une-interface-spécifique-dans-le-service-osrd-core) pour plus de détails sur les overlays), c'est-à-dire en créant des envelopeParts qui seront plus restrictives que le MRSP. La courbe ainsi obtenue est appelée **Max Speed Profile** (profil de vitesse maximale). Il s'agit de l'enveloppe de vitesse maximale du train, tenant compte de ses capacités de freinage.

Etant donné que les courbes de freinage ont un point de fin imposé et que l'équation de freinage n'a pas de solution analytique, il est impossible de prédire leur point de départ. Les courbes de freinage sont donc calculées à rebours en partant de leur point cible, c'est-à-dire le point dans l'espace où une certaine limite de vitesse est imposée (vitesse cible finie) ou le point d'arrêt (vitesse cible nulle).

![Max Speed Profile](../msp.png)

Pour des raisons historiques en production horaire, les courbes de freinages sont calculées à la SNCF avec une décélération forfaitaire, dite décélération horaire (typiquement ~0,5m/s²) sans prendre en compte les autres forces. Cette méthode a donc également été implémentée dans OSRD, permettant ainsi de calculer les freinages de deux manières différentes : avec ce taux horaire ou avec une force de freinage qui vient simplement s'ajouter aux autres forces.

<font color=#aa026d>

### Calcul du Max Effort Profile

</font>

Pour chaque point correspondant à une augmentation de vitesse dans le MRSP ou à la fin d'une courbe de freinage d'arrêt, une courbe d'accélération est calculée. Les courbes d'accélération sont calculées en tenant compte de toutes les forces actives (force de traction, résistance à l'avancement, poids) et ont donc un sens physique.

Pour les envelopeParts dont le sens physique n'a pas encore été vérifié (qui à ce stade sont les phases de circulation à vitesse constante, provenant toujours du MRSP), une nouvelle intégration des équations de mouvement est effectuée. Ce dernier calcul est nécessaire pour prendre en compte d'éventuels décrochages de vitesse dans le cas où le train serait physiquement incapable de tenir sa vitesse, typiquement en présence de fortes rampes (voir [cet exemple](../envelopes_system/#enveloppes-données-vs-enveloppes-calculées)).

L'enveloppe qui résulte de ces ajouts de courbes d'accélérations et de la vérification des plateaux de vitesse est appelée **Max Effort Profile** (profil d'effort maximal).

![Max Effort Profile](../mep.png)

A ce stade, l'enveloppe obtenue est continue et a un sens physique du début à fin. Le train accélère au maximum, roule aussi vite que possible en fonction des différentes limites de vitesse et de ses capacités motrices, et freine au maximum. Le calcul de marche obtenu s'appelle la **marche de base**. Elle correspond au trajet le plus rapide possible pour le matériel roulant donné sur le parcours donné.

<font color=#aa026d>

### Application de marge(s)

</font>

Après avoir effectué le calcul de la marche de base (correspondant au Max Effort Profile dans OSRD), il est possible d'y appliquer des marges (allowances). Les marges sont des ajouts de temps supplémentaire au parcours du train. Elles servent notamment à lui permettre de rattraper son retard si besoin ou à d'autres besoins opérationnels (plus de détails sur les marges [ici](../allowances)).

Une nouvelle enveloppe **Allowances** est donc calculée grâce à des overlays pour distribuer la marge demandée par l'utilisateur sur l'enveloppe d'effort maximal calculée précédemment.

![Marges](../allowances.png)

Dans le calcul de marche d'OSRD, il est possible de distribuer les marges d'une manière linéaire, en abaissant toutes les vitesses d'un certain facteur, ou économique, c'est-à-dire en minimisant la consommation d'énergie pendant le parcours du train.

<font color=#aa026d>

### Simulation de plusieurs trains

</font>

Dans le cas de la simulation de nombreux trains, le système de signalisation doit assurer **la sécurité**. L'effet de la signalisation sur le calcul de marche d'un train est reproduit en superposant des enveloppes dynamiques à l'enveloppe statique. Une nouvelle enveloppe dynamique est introduite par exemple lorsqu'un signal se ferme. Le train suit l'enveloppe économique statique superposée aux enveloppes dynamiques, s'il y en a. Dans ce mode de simulation, un contrôle du temps est effectué par rapport à un temps théorique provenant de l'information temporelle de l'enveloppe économique statique. Si le train est en retard par rapport à l'heure prévue, il cesse de suivre l'enveloppe économique et essaie d'aller plus vite. Sa courbe espace/vitesse sera donc limitée par l'enveloppe d'effort maximum.
