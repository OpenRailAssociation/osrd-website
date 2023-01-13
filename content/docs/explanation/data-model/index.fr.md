---
title: "Données d'infrastructure"
linkTitle: "Données d'infrastructure"
weight: 20
description: "Explique par l'exemple comment les données d'infrastructure sont structurées"
---

<font color=#aa026d>

### Introduction

</font>

Cette page donne un exemple de la manière dont les formats de données sont utilisés pour décrire une infrastructure dans **OSRD**.

À cette fin, prenons comme exemple l'infrastructure-jouet suivante :

![Diagramme de l'Infrastructure](svg_diagrams/small_infra_diagram.drawio.svg)

{{% alert title="Conseil" color="info"%}}
Pour zoomer sur un diagramme, cliquez sur le bouton d'édition qui apparaît au survol de celui-ci.
{{% /alert %}}

Ce diagramme est un aperçu de l'infrastructure avec les lignes et les stations uniquement.

Cette infrastructure ne se veut pas réaliste, mais plutôt destinée à illustrer le modèle de données de l'OSRD.
Cet exemple sera créé étape par étape et expliqué en cours de route.

#### Le générateur d'infrastructures

Dans le [dépôt *OSRD*](https://github.com/DGEXSolutions/osrd) se trouve une [bibliothèque python](https://github.com/DGEXSolutions/osrd/tree/dev/core/examples/generated) conçue pour aider à générer des infrastructures dans un format compris par *OSRD*.

L'infrastructure discutée dans cette section peut être générée grâce au fichier [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py). Pour en savoir plus sur les scripts de génération, vous pouvez consulter le [README](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/README.md) correspondant.

<font color=#aa026d>

### Pistes

</font>

#### Sections de piste (Track Sections)

Les premiers objets que nous devons définir sont les `TrackSections`. La plupart des autres objets sont positionnés par rapport aux sections de voie.

Une section de voie est une section de rail (sans les aiguillages). On peut choisir de diviser les voies de son infrastructure en autant de sections qu'on le souhaite. Ici, nous avons choisi d'utiliser les sections de voie les plus longues possibles, ce qui signifie qu'entre deux aiguillages, il y a toujours une seule section de voie.

Les sections de voie sont ce sur quoi les trains simulés roulent. Ils sont l'équivalent abstrait des sections de rails physiques. Les sections de voie sont bidirectionnelles.

Dans cet exemple, nous définissons deux voies pour la ligne entre les stations Ouest et Nord-Est. Nous avons également des voies de contournement aux stations Nord et Centre-Ouest pour plus de réalisme. Enfin, nous avons trois voies distinctes dans la station Ouest, puisqu'il s'agit d'une plaque tournante majeure dans notre infrastructure imaginaire.

![Diagramme des sections de voies](svg_diagrams/small_infra_rails.drawio.en.svg)

{{% alert title="Important" color="warning"%}}
Les `TrackSections` sont représentées par des flèches dans ce diagramme pour souligner le fait qu'elles ont un **début** et une **fin**. C'est important car les objets positionnés sur les sections de voie sont localisés en fonction de leur distance par rapport au **début** de leur section de voie.

Par conséquent, pour placer un objet au début de sa section de piste, définissez son décalage à 0. Pour le déplacer à la fin de sa section de piste, définissez son décalage à la `length` de la section de piste.
{{% /alert %}}

Ces attributs sont nécessaires pour que la section de voie soit complète :

* `length` : la longueur de la section de piste en mètres.
* `geo` : les coordonnées dans la vie réelle (geo pour géographique), au format [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON).
* `sch` : les coordonnées dans la vue schématique (sch pour schematic), également au format [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON).
* attributs cosmétiques : `line_name`, `track_name`, `track_number` qui sont utilisés pour indiquer le nom et les étiquettes qui ont été donnés aux pistes / lignes dans la vie réelle.

Pour toutes les sections de voies de notre infrastructure, les attributs `geo` et `sch` sont identiques, et ressemblent beaucoup au schéma donné.

Pour la plupart des sections de voies, leur "longueur" est proportionnelle à ce que l'on peut voir sur le diagramme. Pour préserver la lisibilité, des exceptions ont été faites pour *TA6*, *TA7*, *TD0* et *TD1* (qui font 10km et 25km).

#### Liens de sections de voies

Pour le moment, nous n'avons créé que des sections de voies, qui ne sont pas connectées entre elles (les données géospatiales ne sont pas utilisées pour déduire quelles voies sont connectées).

Les `TrackSectionLinks` sont utilisés pour connecter deux sections de voie ensemble, tout comme un joint de soudure le ferait dans la vie réelle. Dans une simulation OSRD, un train ne peut passer d'une section de voie à une autre que si elles sont reliées par un `TrackSectionLink` (ou par un `Switch`).

Pour connecter plus de deux `TrackSections` ensemble, utilisez les [`Switches`](#aiguillages).

Dans notre infrastructure, comme nous avons choisi d'avoir des sections de voie aussi longues que possible, nous n'avons pas besoin d'utiliser les `TrackSectionLinks`.
Les `TrackSectionLinks` sont toujours optionnels : deux sections de voies reliées par un lien se comportent comme une seule section de voie.

#### Aiguillages

Un `Switch` représente ce à quoi vous vous attendez : des aiguillages ferroviaires.

Les aiguillages peuvent être vus comme une collection de liens de sections de voies, partitionnés en groupes. Chaque groupe représente un état de l'aiguillage. L'aiguillage d'un groupe peut prendre du temps, et au maximum un lien peut être prêt à être utilisé à la fois.

Dans le monde réel, les aiguillages ne sont pas uniques, mais plutôt des instances de modèles existants.
Ainsi, les liens et les groupes ne font pas partie du switch lui-même, mais d'un objet `SwitchType`, qui est partagé par les switches du même modèle.

##### Types d'aiguilles

Les `SwitchTypes` ont deux attributs obligatoires :

* `ports` : Une liste de noms de ports. Un port est un point d'extrémité qui peut être connecté à une section de voie.
* `groups` : Une correspondance entre les noms de groupes et les listes de liens entre deux ports.

A tout moment, toutes les aiguilles ont un groupe actif, et peuvent avoir un lien actif, qui appartient toujours au groupe actif. S'il y a un lien actif, il est actif dans une direction donnée. Pendant une simulation, le changement de lien actif à l'intérieur d'un groupe est instantané, mais le changement de lien actif entre les groupes prend un temps configurable.
Ceci est dû au fait qu'un switch est un objet physique, et que le changement de lien actif peut impliquer le déplacement de certaines de ses parties. Les `Groupes` sont conçus pour représenter les différentes positions qu'un switch peut avoir. Chaque `groupe` contient les liens qui peuvent être utilisés dans la position du switch associé.

La durée nécessaire pour changer de groupe est stockée à l'intérieur du `Switch`, car elle peut varier en fonction de l'implémentation physique de l'interrupteur.

Nos exemples utilisent actuellement trois types de switch. Les types d'interrupteurs sont comme les autres objets, et peuvent facilement être ajoutés si nécessaire.

**1) L'aiguillage**

L'omniprésent aiguillage en Y, qui peut être considéré comme la fusion de deux voies ou la séparation d'une voie.

Ce type d'aiguillage possède trois ports : *base*, *gauche* et *droite*.

![Diagramme d'aiguillage](svg_diagrams/point_switch.en.svg)

Il y a deux groupes, chacun avec une connexion dans leur liste : `LEFT`, qui connecte *base* à *gauche*, et `RIGHT` qui connecte *base* à *droite*.

Ainsi, à tout moment, un train peut aller de la *base* à la *gauche* ou de la *base* à la *droite* mais jamais aux deux en même temps. Un train ne peut pas aller de *gauche* à *droite*.

Un aiguillage n'a que deux positions :

![Diagramme des positions de l'aiguillage](svg_diagrams/point_switch_positions.en.svg)

**2) L'aiguillage de croisement**

Il s'agit simplement de deux voies qui se croisent.

Ce type a quatre ports : *nord*, *sud*, *est* et *ouest*.

![Diagramme de l'aiguillage croisé](svg_diagrams/cross_switch.en.svg)

Il ne comporte qu'un seul groupe contenant deux connexions : *nord* vers *sud* et *ouest* vers *est*. En effet, ce type d'interrupteur est *passif* : il n'a pas de pièces mobiles. Bien qu'il n'ait qu'un seul groupe, il est tout de même utilisé par la simulation pour faire respecter les réservations de route.

Voici les deux connexions différentes que ce type d'interrupteur possède :

![Diagramme des positions des aiguilles croisés](svg_diagrams/cross_switch_positions.en.svg)

**3) L'interrupteur en croix double**

Celui-ci ressemble plus à deux interrupteurs à pointe dos à dos. Il possède quatre ports : *sud1*, *sud2*, *nord1* et *nord2*.

![Diagramme d'un interrupteur à double croix](../svg_diagrammes/double_cross_switch.en.svg)

Cependant, il comporte quatre groupes, chacun avec une connexion. Les quatre groupes sont représentés dans le diagramme suivant :

![Diagramme des positions de l'interrupteur croisé double](../svg_diagrammes/double_cross_switch_positions.en.svg)

##### Retour aux aiguilles

Un `Switch` possède trois attributs :

* `switch_type` : l'identifiant [`SwitchType`](#types-daiguilles) de cette aiguille.
* `ports` : une correspondance entre les noms de port et les extrémités des sections de piste.
* `group_change_delay` : le temps qu'il faut pour changer le groupe de l'aiguillage qui est activé.

Les noms des ports doivent correspondre aux ports du type d'aiguillage choisi. Les extrémités de la section de voie peuvent être de début ou de fin, faites attention à choisir les bonnes.

La plupart des aiguillages de notre exemple sont des aiguillages réguliers. Le chemin de la gare du Nord à la gare du Sud a deux aiguillages de croisement, et il y a un double aiguillage de croisement juste avant que la ligne principale ne se divise en lignes Nord-Est et Sud-Est.

![Diagramme des sections de voie et des aiguillages](svg_diagrams/small_infra_rails_n_points.drawio.en.svg)

#### Courbes et pentes

Les `Courbes` et les `Pentes` sont essentielles pour des simulations réalistes. Ces objets sont définis comme une plage entre un décalage de `début` et de `fin` d'une section de voie. Si une courbe / pente s'étend sur plus d'une section de voie, elle doit être ajoutée à toutes les sections.

Les valeurs des courbes / pentes sont constantes sur toute leur étendue. Pour des courbes / pentes variables, il faut créer plusieurs objets.

Les valeurs de pente sont mesurées en *mètres par kilomètres*, et les valeurs de courbe sont mesurées en *mètres* (le rayon de la courbe).

{{% alert title="" color="primary"%}}
N'oubliez pas que la valeur de début doit toujours être inférieure à la valeur de fin. C'est pourquoi les valeurs de courbe/pente peuvent être négatives : une pente ascendante de 1 allant du décalage 10 à 0 est identique à une pente descendante de -1 allant des décalages 0 à 10.
{{% /alert %}}

Dans le fichier [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py), nous avons des pentes sur les sections de piste *TA6*, *TA7*, *TD0* et *TD1*.

Il y a également des courbes sur les sections de voie *TE0*, *TE1*, *TE3* et *TF1*.

<font color=#aa026d>

### Enclenchement

</font>

Jusqu'à présent, tous les objets ont contribué à la topologie (forme) des voies. La topologie serait suffisante pour que les trains puissent naviguer sur le réseau, mais pas assez pour le faire en toute sécurité. pour assurer la sécurité, deux systèmes collaborent :

* L'enclenchement garantit que les trains sont autorisés à avancer
* La signalisation est le moyen par lequel l'enclenchement communique avec le train

#### Détecteurs

Ces objets sont utilisés pour créer des sections TVD (Track Vacancy Detection section) : la zone de la voie située entre les détecteurs est une section TVD. Lorsqu'un train rencontre un détecteur, la section dans laquelle il entre est occupée. La seule fonction des sections TVD est de localiser les trains.

Dans la réalité, les détecteurs peuvent être des [compteurs d'essieux](https://en.wikipedia.org/wiki/Axle_counter) ou des [circuits de voie](https://en.wikipedia.org/wiki/Track_circuit) par exemple.

Pour que cette méthode de localisation soit efficace, les détecteurs doivent être placés régulièrement le long de vos voies, pas trop nombreux pour des raisons de coût, mais pas trop peu, car les sections TVD seraient alors très grandes et les trains devraient être très éloignés les uns des autres pour être distingués, ce qui réduirait la capacité.

Il y a souvent des détecteurs à proximité de tous les côtés des aiguillages. De cette façon, l'enclenchement est averti presque immédiatement lorsqu'un aiguillage est libéré, qui est alors libre d'être utilisé à nouveau.

{{% alert title="" color="info"%}}
Prenons l'exemple d'un aiguillage de croisement : si le train A le franchit du *nord* au *sud* et que le train B vient le franchir de l'*ouest* à l'*est*, dès que le dernier wagon du train A a franchi l'aiguillage, B devrait pouvoir partir, puisque A se trouve maintenant sur une section de voie complètement indépendante.
{{% /alert %}}

Dans *OSRD*, les détecteurs sont des objets ponctuels, donc tous les attributs dont ils ont besoin sont leur `id`, et la localisation de la voie (`track` et `offset`).


![Diagramme infrarouge avec tous les détecteurs](svg_diagrams/small_infra_detectors.drawio.en.svg)

{{% alert title="" color="info"%}}
Les carrés agglutinés représentent plusieurs détecteurs à la fois. En effet, certains tronçons de voie n'étant pas représentés sur toute leur longueur, nous n'avons pas pu représenter tous les détecteurs du tronçon de voie correspondant.
{{% /alert %}}

Quelques notes :

* Entre certains points, nous n'avons ajouté qu'un seul détecteur (et non pas deux), car ils étaient très proches les uns des autres, et cela n'aurait eu aucun sens de créer un minuscule TVDS entre les deux. Cette situation s'est produite sur des sections de voies (*TA3*, *TA4*, *TA5*, *TF0* et *TG3*).
* Dans notre infrastructure, il y a relativement peu de sections de voie qui sont assez longues pour nécessiter plus de détecteurs que ceux liés aux aiguillages. A savoir, *TA6*, *TA7*, *TDO*, *TD1*, *TF1*, *TG1* et *TH1*. Par exemple, *TD0*, qui mesure 25 km, compte en fait 17 détecteurs au total.

#### Arrêts tampons

Les `BufferStops` sont des obstacles destinés à empêcher les trains de glisser dans des culs-de-sac.

Dans notre infrastructure, il y a un butoir sur chaque section de voie qui a un cul-de-sac. Il y a donc 8 butoirs au total.

Avec les détecteurs, ils définissent les limites des sections [TVD](https://ressources.data.sncf.com/explore/dataset/lexique-des-acronymes-sncf/table/?sort=abreviation&q=TVD) (voir [Detectors](#détecteurs)).

#### Itinéraires

Une `Route` est un itinéraire dans l'infrastructure. Un sillon est une séquence de routes. Les itinéraires sont utilisés pour réserver des sections de sillon avec l'enclenchement. Voir la [documentation dédiée](/fr/developers/internals/simulation-model/).

Il est représenté avec les attributs suivants :

* `entry_point` et `exit_point` : Références de détecteurs ou de butées qui marquent le début et la fin de l'itinéraire.
* `entry_point_direction` : Direction à prendre sur la section de voie depuis `entry_point` pour commencer l'itinéraire.
* `switches_direction` : Un ensemble de directions à suivre lorsqu'on rencontre une aiguille sur notre itinéraire, de manière à reconstituer cet itinéraire de `entry_point` jusqu'à `exit_point`.
* `release_detectors` : Lorsqu'un train franchit un détecteur de libération, les ressources réservées depuis le début de la route jusqu'à ce détecteur sont libérées.

<font color=#aa026d>

### Signalisation

</font>

Thanks to interlocking, trains are located and allowed to move. It's a good start, but meaningless until trains are made aware of it. C'est là que les "signaux" entrent en jeu : les signaux réagissent aux enclenchements et peuvent être vus par les trains.

La façon dont les trains réagissent aux signaux dépend de l'aspect, du type de signal et du système de signalisation.

Voici les attributs les plus importants des signaux :

* `linked_detector` : Le [détecteur] lié (#détecteurs).
* `type_code` : Le type de signal.
* `direction` : La direction qu'il protège, qui peut être simplement interprétée comme la façon dont il peut être vu par un train entrant (puisqu'il n'y a des feux que d'un côté...). La direction est relative à l'orientation de la section de voie.
* Des attributs cosmétiques comme `angle_geo` and `side` qui contrôlent la manière dont les signaux sont affichés dans le front-end.

Voici une visualisation de comment on peut représenter un signal, et quelle direction il protège.

![Exemple de signal de direction](svg_diagrams/signal_dir.en.svg)

<br/>

La manière dont les signaux sont disposés dépend fortement du système de signalisation et du gestionnaire de l'infrastructure.

Voici les règles de base utilisées pour cet exemple d'infrastructure :

* Nous ajoutons deux signaux d'espacement (un par direction) pour chaque détecteur qui découpe une longue section de TVD en plus petites sections.
* Les entrées d'aiguillage où un train pourrait devoir s'arrêter sont protégées par un signal (qui est situé à l'extérieur de la section TVD de l'aiguillage). Il doit être visible depuis la direction utilisée pour approcher l'aiguillage. Lorsqu'il y a plusieurs aiguillages dans une rangée, seul le premier a généralement besoin d'être protégé, car l'enclenchement est généralement conçu pour ne pas encourager les trains à s'arrêter au milieu des intersections.

Notez que les détecteurs liés à au moins un signal ne sont pas représentés, car il n'y a pas de signaux sans détecteurs associés dans cet exemple.
Pour obtenir le `id` d'un détecteur lié à un signal, prenez le `id` du signal et remplacez *S* par *D* (par exemple SA0 -> DA0).

![Diagramme infrarouge avec tous les signaux](svg_diagrams/small_infra_signals.drawio.en.svg)

{{% alert title="" color="info"%}}
Sur *TA6*, *TA7*, *TD0* et *TD1* nous n'avons pas pu représenter tous les signaux car ces sections de voie sont très longues et comportent de nombreux détecteurs, donc de nombreux signaux.
{{% /alert %}}

<font color=#aa026d>

## Divers

</font>

#### Points opérationnels

Les `OperationalPoints` sont des collections de points (`OperationalPointParts`) d'intérêt.

Par exemple, il peut être pratique de stocker l'emplacement des plateformes en tant que parties et de les regrouper par station dans des points opérationnels.

Dans l'exemple de l'infrastructure, nous n'avons utilisé que des points opérationnels pour représenter les stations. Les parties de points opérationnels sont représentées par des diamants violets. Gardez à l'esprit qu'un seul point opérationnel peut contenir plusieurs parties.

![Exemples de points opérationnels](svg_diagrams/small_infra_op_points.drawio.en.svg)

#### Limites de gabarit de chargement

Ces objets s'apparentent aux `Pentes` et aux `Courbes` : ils couvrent une plage de section de voie, avec un décalage de `début` et de `fin`. Il représente une restriction sur les trains qui peuvent circuler sur la plage donnée, par poids ou par type de train (fret ou passagers).

Nous n'en avons pas mis dans nos exemples.

#### Sections de vitesse

Les `SpeedSections` représentent les limites de vitesse (en mètres par seconde) qui sont appliquées sur certaines parties des voies. Une `SpeedSection` peut s'étendre sur plusieurs sections de voie, et ne couvre pas nécessairement la totalité des sections de voie. Les sections de vitesse peuvent se chevaucher.

Dans notre exemple d'infrastructure, nous avons une section de vitesse couvrant l'ensemble de l'infrastructure, limitant la vitesse à 300 km/h. Sur une plus petite partie de l'infrastructure, nous avons appliqué des sections de vitesse plus restrictives.

![Exemples de sections de vitesse](svg_diagrams/speed_sections.en.svg)