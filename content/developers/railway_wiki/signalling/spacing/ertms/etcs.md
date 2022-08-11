---
title: "ETCS"
linkTitle: "ETCS"
weight: 100000
description: European Train Control System
---

### Généralités

ETCS est le système européen de contrôle commande des trains. La partie bord est interopérable. La partie sol peut être
différente selon les pays tout en répondant aux mêmes objectifs de fonctionnalité.

Il existe quatre niveaux différents dont deux sont en service : L’[ETCS 1](#etcs-niveau-1) et L’[ETCS 2](#etcs-niveau-2). L’ETCS 0 est interdit en France.
L’ETCS 3 est encore à l’état de développement dans la plupart des pays de l’Union européenne.

Il s’agit d’un système de signalisation de cabine et de contrôle de vitesse faisant appel aux trois composantes
suivantes :
- **sol** : pour la gestion des circulations comprenant notamment l’espacement, la protection des points à protéger et des
circulations
- **bord** : pour l’affichage des ordres et informations à destination du conducteur et le contrôle de la bonne exécution de
ceux-ci, dénommé EUROCAB
- **liaison** : pour les échanges de données entre le sol et le bord :
  - liaison ponctuelle unidirectionnelle du sol vers le bord par EURO BALISES, 
  - liaison radiotéléphonique continue et bidirectionnelle par [GSM-R](../gsm-r/) DATA pour [ETCS2](#etcs-niveau-2) dénommé EURORADIO.

Sur le [RFN](../../../../glossary/#r), sont mis en oeuvre les niveaux d'exploitations suivants :
- L’[ETCS1](#etcs-niveau-1) sur certaines lignes parcourables jusqu’à 220 km/h. Il correspond à un système de signalisation de cabine,
généralement superposé à la signalisation au sol existante, dont les informations entre le sol et le bord sont
transmises ponctuellement par eurobalise. 
- L’[ETCS2](#etcs-niveau-2) sur certaines lignes à grande vitesse. Il correspond à un système de signalisation de cabine dont les
informations entre le sol et le bord sont transmises en temps utile ou cycliquement par liaison permanente [GSM-R](../gsm-r/) DATA. 

    L’[ETCS2](#etcs-niveau-2) est un système qui ne nécessite pas la matérialisation des cantons sur le terrain.

Préalablement à tout déplacement, les données relatives au train doivent être saisies ou paramétrées à bord. Ainsi, le
système peut, à partir des données bord et sol, superviser le train, c'est-à-dire contrôler sa vitesse et ses
déplacements et intervenir en cas de nécessité.

La détection d'une circulation sur une partie de voie est réalisée au moyen de circuits de voie ou de compteurs
d’essieux.
En [ETCS2](#etcs-niveau-2), la combinaison des équipements sol et bord est telle qu’elle ne nécessite, normalement, pas de signalisation
complémentaire au sol.

### Équipement bord

Le bord est constitué d'un DMI, d’un EVC, de capteurs odométriques (de vitesse), d’antennes pour la lecture des PI ETCS,
un modem [GSM-R](../gsm-r/) (Euroradio) pour ETCS2, d’une unité juridique d’enregistrement des paramètres d’exploitation,
d’interfaces avec le train.

![](../../../images/document-pedagogique-signaux-regimes-exploitation-v1/image-106.png)

### Le DMI

Le DMI est l’interface entre le conducteur et la machine. Il permet d’afficher les ordres et instructions en fonction
des données sol et/ou bord. Le conducteur renseigne également le système par saisie de données.

L’espacement des circulations et la protection des points dangereux se traduisent par l’affichage en temps utile d’une
vitesse but et d’une distance but. La vitesse but doit être respectée par le conducteur au point défini par la distance but.

En « marche normale », le DMI indique au conducteur la vitesse autorisée qui ne doit pas être dépassée. Dans ce cas, il
n’y a pas d’affichage de la distance but et de la vitesse but.

Un secteur pouvant présenter différentes couleurs est utilisé pour indiquer les ordres de vitesse ou d'arrêt.

Enfin, d’autres indications sont affichées telles que la signalisation de traction électrique, le niveau d'exploitation,
le mode technique. Les changements d’indication au DMI peuvent être accompagnés d’indications sonores. Une zone en
partie basse du DMI est également réservée pour l’affichage de messages textuels. Certaines informations complémentaires
peuvent également être affichées par l'entreprise ferroviaire.

![](../../../images/document-pedagogique-signaux-regimes-exploitation-v1/image-107.png)

> Dans cet exemple, le conducteur autorisé à circuler à 140 km/h maximum, circule à 125 km/h, il va devoir observer une
phase de ralentissement afin de respecter la vitesse maxi de 100 km/h (vitesse But) à une distance de 2850 mètres (distance But).

Le DMI utilise un code couleur, avec la signification suivante :
- **blanc/gris clair/gris foncé** : aucune action immédiate n’est exigée du conducteur
- **jaune** : le conducteur doit intervenir si la vitesse réelle est proche de la vitesse autorisée (risque de passer à
la couleur orange en l’absence de réaction)
- **orange** : l’intervention est insuffisante (risque de passer à la couleur rouge en l’absence de réaction du conducteur)
- **rouge** : réaction trop tardive du conducteur, prise en charge par le système (peut revenir au jaune, au gris ou au
blanc après une action appropriée)

### ETCS niveau 1

#### Transmission sol-bord

Ce niveau utilise une transmission ponctuelle à l'aide de balises placées au pied des signaux et en amont. Ces balises
(eurobalises) communiquent les données de signalisation au train.

#### Détection des trains

Le niveau 1 nécessite l'utilisation d'un système de détection des trains au sol (tel que des circuits de voie, compteurs
d'essieux et autres). Toutes ces informations sont donc transmises ponctuellement au train. La cadence de l’information
donnée pouvant être augmentée en jouant sur le nombre de balises, ou en installant une boucle (euroloop), équivalent
d'une balise, mais longeant la ligne sur une certaine distance.

### ETCS niveau 2

#### Transmission sol-bord

Les données de signalisation sont transmises de manière permanente, via le réseau [GSM-R](../gsm-r/). Le train communique constamment
sa position (qu'il détermine avec un odomètre) au centre de contrôle qui lui communique en retour les actions à
effectuer (vitesse, arrêt, etc.).

Des eurobalises sont toujours présentes sur la voie pour recaler éventuellement l'odométrie embarquée.

#### Détection des trains

Un système de détection des trains au sol s’appuie sur l’existence des circuits de voie pour localiser un train aval sur
un canton. Cette information est transmise au radio block center (RBC) qui gère ensuite l’espacement entre deux circulations.
Le train suiveur reçoit une nouvelle autorisation de circulation par l’intermédiaire de la liaison radio [GSM-R](../gsm-r/).
Dès que le train aval libère un canton le poste central de commande reçoit l’information correspondante du sol qui est
transmise par liaison radio au train suiveur.

#### Avantage

Le niveau 2 rend disponible quasi immédiatement une information « libératoire » pour le train suiveur et contribue ainsi
à augmenter la fluidité. Cette immédiateté est la différence par rapport à la signalisation conventionnelle, où une
demi-minute est parfois nécessaire pour libérer un aiguillage alors que le train est déjà bien loin.

### Les modes techniques

Les modes techniques utilisés sur le RFN sont :
- **Mode FS** : Conduite en supervision complète.

  Toutes les données train et voie sont disponibles à bord.

  Le [DMI](#le-dmi) affiche :
  - la vitesse réelle du train et la vitesse autorisée
  - lors de l'approche d'un [EOA](../../../../glossary/#e), d'un repère d'arrêt ETCS ou un heurtoir, la vitesse but et la distance but

  Le système « bord » supervise la vitesse, le déplacement du train, le respect de l’[EOA](../../../../glossary/#e) matérialisé par un repère
d’arrêt ETCS, un signal d’arrêt ou un heurtoir en ETCS1.

- **Mode [OS](../../../../glossary/#o)** : Conduite en marche à vue.

  Toutes les données train et voie sont disponibles à bord sauf l’assurance de la libération de toute ou partie de la
voie allouée au train.

  Le DMI affiche les mêmes indications qu’en mode FS.

  Le système « bord » assure également la supervision comme en mode FS.
 
- **Mode [SR](../../../../glossary/#s)** : Conduite sous la responsabilité des agents.

  Ce mode technique est utilisé pour les situations dégradées et la procédure « Mise en service » lorsque le bord n’a
pas reçu d’allocation de voie. Le système « bord » ne supervise que la vitesse du mode SR et le franchissement des
repères d'arrêt ETCS et des signaux d’arrêt.

- **Mode [SH](../../../../glossary/#s)** : Circulation en manœuvre.

  Ce mode technique est sélectionné par le conducteur pour les mouvements de manœuvre. Le système « bord » ne supervise
que la vitesse du train.

- **Mode [NL](../../../../glossary/#n)** : Conduite d'un engin moteur non en tête du mouvement

  Ce mode technique est utilisé en cas de pousse ou de double traction.

### Protection contre le rattrapage

En mode FS, une vitesse autorisée affichée sans la présentation de l'[EOA](../../../../glossary/#e) signifie « marche normale ».

La [MA](../../../../glossary/#m) constituée d’un ou plusieurs cantons est allouée canton par canton, par ajout successif d’un canton.
Si le canton en aval du dernier canton alloué est occupé le train doit être en mesure de s’arrêter avant l’entrée de ce
canton. Le conducteur est alors avisé par une indication sonore au DMI.

Dès lors, les indications de conduite (vitesse but égale à 0 et une distance but) permettant de respecter la courbe de
freinage sont affichées.

Le conducteur doit ralentir de façon à être en mesure de s’arrêter avant l’[EOA](../../../../glossary/#e), tout en respectant la vitesse autorisée.