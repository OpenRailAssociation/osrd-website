---
title: "BA"
linkTitle: "BA"
weight: 10 000
description: Block Automatique
---

### Principe

Le block automatique se caractérise en block automatique lumineux (BAL) et en block automatique à permissivité restreinte (BAPR) par :
- le fonctionnement entièrement automatique des signaux de cantonnement dont le changement d’état (fermeture ou ouverture) est provoqué par le passage des circulations sans aucune intervention humaine ;
- l’état d’occupation de chaque canton, agissant directement sur le signal d’entrée correspondant est obtenu par le circuit de voie en BAL, généralement par un comptage d’essieu en BAPR.
  Le BAL permet un débit élevé des circulations sur la ligne.

### Fonctionnement d'un circuit de voie

Un circuit de voie est principalement constitué de trois éléments :
- un émetteur, branché à l’une des extrémités de la zone. Il délivre un courant qui peut être de différente nature selon les types de circuit de voie (continu, impulsionnel, alternatif, etc.) ;
- une ligne de transmission, constituée par les deux files de rails ;
- un récepteur, branché à l’autre extrémité de la zone. Il assure le filtrage, l’amplification et la transformation du signal reçu via les rails, ce qui agit sur un relais appelé relais de voie. Les contacts de ce relais sont utilisés pour établir ou couper le circuit électrique du signal d’entrée du canton.

Lorsqu’aucun véhicule n’est présent sur la zone délimitant le circuit de voie (voie libre), le signal délivré par l’émetteur parvient au récepteur à travers la ligne de transmission, et le relais de voie est excité. Le feu d’entrée du canton est à voie libre (cas 1 ci-dessous).

Lorsqu’un véhicule est présent, son premier essieu agit comme une faible résistance, appelée shunt, qui court-circuite la transmission. Dans ce cas, le niveau du signal parvenant au récepteur n’est plus suffisant et le relais de voie se désexcite, ce qui entraine la fermeture du signal d’entrée du canton (cas 2 ci-dessous).

![](/osrd-website/images/docs/railway-wiki/signalling/image-079.png)

### Fonctionnement des compteurs d'essieux

Un compteur d’essieux est un dispositif technique servant à détecter la présence d’une circulation sur une section, par
comptage des essieux qui franchissent les détecteurs encadrant cette section.

Un point de détection est installé à chaque extrémité de la section, et chaque fois qu’un essieu passe sur ce point au
début de la section, un compteur s’incrémente. Quand le train passe sur le point de détection en fin de la section, le
compteur décrémente. Si le nombre final est zéro, la section est présumée libre pour un deuxième train et le signal
d’entrée du canton présentera l’indication « voie libre ».

