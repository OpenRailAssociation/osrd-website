---
title: "3 - Le système d'enveloppes"
linkTitle: "3 - Le système d'enveloppes"
weight: 30
---

Le système d'enveloppes est une interface créée spécifiquement pour le calcul de marche d'OSRD. Il permet de manipuler différentes courbes espace/vitesse, de les découper, de les mettre bout à bout, d'interpoler des points spécifiques, et d'adresser beaucoup d'autres besoins nécessaires au calcul de marche.

### <font color=#aa026d>Une interface spécifique dans le service OSRD Core</font>

Le système d'enveloppes fait partie du service core d'OSRD (voir [l'architecture du logiciel](https://dgexsolutions.github.io/osrd-website/fr/users/docs/technical_and_physical_choices/architecture/)).

Ses principaux composants sont :

**1 - EnvelopePart :** courbe espace/vitesse, définie comme une séquence des points, et possédant des métadonnées indiquant par exemple s'il s'agit d'une courbe d'accélération, de freinage, de maintien de vitesse, etc.

**2 - Envelope :** liste d'EnvelopeParts mises bout à bout et sur laquelle il est possible d'effectuer certaines opérations :

- vérifier la continuité dans l’espace (obligatoire) et dans la vitesse (facultative)
- chercher la vitesse minimale et/ou maximale de l'enveloppe
- couper une partie de l’enveloppe entre deux points de l'espace
- effectuer une interpolation de vitesse à une certaine position
- calculer le temps écoulé entre deux positions de l’enveloppe

![envelope_scheme](../envelopes_scheme.png)

**3 - Overlays :** système permettant d’ajouter des EnvelopePart plus contraignantes (ie dont la vitesse est plus faible) à une enveloppe existante.

### <font color=#aa026d>Enveloppes données vs enveloppes calculées</font>

Pendant la simulation, le train est censé suivre certaines instructions de vitesse. Celles-ci sont modélisées dans OSRD par des enveloppes sous forme de courbes espace/vitesse. On en distingue deux types :

- Les enveloppes provenant **des données d'infrastructure et de matériel roulant**, comme par exemple la vitesse maximale de la ligne et la vitesse maximale du train. Etant des données d'entrée de notre calcul, elles ne correspondent pas à des courbes ayant un sens physique car elles ne sont pas issues des résultats d'une intégration réelle des équations physiques du mouvement.
- Les enveloppes résultant **d'une intégration réelle** des équations du mouvement physique. Elles correspondent à une courbe physiquement tenable par le train et contiennent également des informations sur le temps.

Un exemple simple pour illustrer cette différence : si l'on simule un trajet de TER sur une ligne de montagne, une des données d'entrée va être une enveloppe de vitesse maximale à 160km/h, correspondant à la vitesse maximale de notre TER. Mais cette enveloppe ne correspond pas à une réalité physique car il se peut que sur certaines portions la rampe soit trop raide pour que le train arrive effectivement à maintenir cette vitesse maximale de 160km/h. L'enveloppe calculée présentera donc dans cet exemple un décrochage de vitesse dans les zones de fortes rampes, là où l'enveloppe donnée était parfaitement plate.
