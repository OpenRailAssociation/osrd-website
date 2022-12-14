---
title: "BAL"
linkTitle: "BAL"
weight: 100 000
description: Block Automatique Lumineux
---

Le signal d’entrée du canton présente une indication liée à l’état d’occupation du ou des cantons suivants, selon les
règles suivantes :
- indication d’arrêt lorsque le canton est occupé par au moins une portion du train
- annonce lorsque le canton suivant est occupé
- voie libre par défaut (sauf signaux Nf)

La longueur maximale d’un canton est en principe de 2800 m. Elle est généralement de 1500 m sur les lignes parcourues à
la vitesse maximale de 160 km/h.

![](/osrd-website/images/docs/railway-wiki/signalling/image-080.png)

### Avantages du BAL

Le BAL offre un niveau élevé de sécurité et permet un débit important.

### Limites

L’installation du BAL est très coûteuse, et son fonctionnement nécessite une garantie de contact électrique entre la
roue et le rail.

### Implémentation

Simuler correctement le système BAL nécessite de respecter les critères suivants :
- lorsque la tête du train pénètre dans un canton, le signal d'entrée de celui-ci passe en indication d'arrêt
- lorsque la queue du train libère un canton, son signal d'entrée passe en annonce
- lorsque la queue du train libère un canton, le signal d'entrée du canton précédent passe en voie libre
- les signaux présentent une voie libre par défaut, sauf les signaux Nf qui sont par défaut en indication d'arrêt