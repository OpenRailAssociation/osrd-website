---
title: "Signalisation"
linkTitle: "Signalisation"
weight: 43
description: "Décrit la modèle de signalisation"
---


{{% pageinfo color="warning" %}}
Ce document est en attente de revue
{{% /pageinfo %}}

## Description

La couche de signalisation comprend l'ensemble des signaux, qui réagissent au cantonnement et à la réservation.
Les signaux peuvent être de différent types, et sont chargés de manière modulaire. Seul importe leur comportement
vis-à-vis de l'état de l'infrastructure, et la réaction des trains à la signalisation.

Les signaux sont reliés entre eux par des cantons. Les cantons définissent les mouvements autorisés par la signalisation.

## Objectifs

Le système de signalisation est à la croisée de nombreux besoins:
 - il doit permettre de simuler la signalisation de manière réaliste, dans une simulation multi-trains
 - il doit permettre au système de détection de conflits de déterminer quelles ressources sont requises pour le train
 - il doit permettre aux utilisateurs de l'application d'éditer et d'afficher les signaux
 - il doit permettre de visualiser les signaux sur une carte

## Exigences de conception

Les données statiques :
- doivent permettre au front de réprésenter les signaux (choisir une image)
- doivent permettre à l'éditeur de configurer les signaux
- doivent permettre au back de simuler les signaux
- doivent être proches du métier
- doivent permettre de modéliser des signaux composites, qui représentent en un seul signal physique plusieurs signaux logiques

Pour la simulation de la signalisation :

- des cantons doivent être générés, à la fois pour l'utilisateur et la **compatibilité pathfinding**
- chaque signal doit connaître le **prochain signal compatible**
- chaque signal doit connaître les **zones qu'il protège**
- fournir aux modules de signalisation le **minimum d'information nécessaire** à leur fonctionnement
- pouvoir utiliser un module de signalisation sans avoir à instancier une simulation complète
- pouvoir avoir des modules qu'on puisse charger dans un ordre indépendant

## Présupposés

- chaque signal physique peut être décomposé en une liste de signaux logiques, qui sont tous associés à un système de signalisation
- les cantons ont un type
- il est possible de déterminer étant donné le seul signal, ses propriétés de cantonnement
- il n'existe pas de cantons qui chevauchent une fin ou un début de route
- les cantons qui ne sont pas couverts par des routes n'existent pas ou peuvent être ignorés
- un train n'utilise qu'un seul système de signalisation capable de transmettre la MA à la fois


## Design des systèmes de signalisation

Chaque système de signalisation a :
 - un identifiant unique (une chaine de caractères)
 - un ensemble de rôles :
   - transmission de la MA
   - transmission des limites de vitesse
 - son type d'état de signal, qui doit permettre de :
   - savoir s'il est contraignant à cause d'une MA réduite
   - déterminer une représentation graphique de ce signal
   - faire réagit un train à ce signal
 - les paramètres du signal, qui sont utilisés à la fois dans le front pour le configurer et dans le back pour déterminer les informations de cantonnement liées au signal
 - la condition de cantonnement, qui permet de savoir si un signal délimite un canton


Il est à noter que si un système de signalisation a un double rôle transmission de MA et des limites de vitesse, tous les signaux dans ce système ne sont pas forcément chargés de transmettre des informations de limite de vitesse.

```yaml
{
    # unique identifier for the signaling system
    "id": "bal",
    "version": "1.0",
    # a list of roles the system assumes
    "roles": ["MA", "SPEED_LIMITS"],
    # the schema of the dynamic state of signals of this type
    "signal_state": [
        {"kind": "enum", "field_name": "aspect", values: ["VL", "A", "S", "C"]},
        {"kind": "flag", "field_name": "ralen30"},
        {"kind": "flag", "field_name": "ralen60"},
        {"kind": "flag", "field_name": "ralen_rappel"}
    ],
    # the schema of the settings signals of this type can read
    "signal_settings": [
        {"kind": "flag", "field_name": "Nf", "display_name": "Non-franchissable"},
        {"kind": "flag", "field_name": "has_ralen30", "default": false, "display_name": "Ralen 30"},
        {"kind": "flag", "field_name": "has_rappel30", "default": false, "display_name": "Rappel 30"},
        {"kind": "flag", "field_name": "has_ralen60", "default": false, "display_name": "Ralen 60"},
        {"kind": "flag", "field_name": "has_rappel60", "default": false, "display_name": "Rappel 60"}
    ],

    # these are C-like boolean expressions:
    # true, false, <flag>, <enum> == value, && and || can be used

    # used to evaluate whether a signal is a block boundary.
    "block_boundary_when": "Nf",

    # used for conflict detection. 
    "constraining_ma_when": "aspect != VL"
}
```

## Design des cantons

Les cantons ont plusieurs attributs:
 - un système de signalisation
 - un **chemin**, qui représente les zones protégées par le canton, et leur état attendu (au même format que le chemin des routes)
 - un **signal d'entrée**, optionnel (quand le canton pars d'un butoir)
 - des **signaux intermédiaires** éventuels (c'est utilisé avec des systèmes du style BAPR)
 - un **signal de sortie**, optionnel (quand le canton se termine à un butoir)

Le chemin est exprimé de détecteur en détecteur afin de pouvoir faire un rapprochement avec le graphe des routes.

Quelques remarques:
- il peut y avoir plusieurs systèmes de signalisation superposés sur la même infrastructure. le modèle pars du principe qu'un seul système à la fois est actif
- un canton n'a pas d'état: on peut se reposer sur l'état dynamique des zones qui le compose
- les signaux utilisent les cantons pour savoir quelles zones sont à protéger à un instant donné

## Design des signaux

Chaque signal physique est composé d'un ou plusieurs signaux logique, dont les aspects sont combinés pour être représentés sur le terrain. Lors de la simulation, les signaux logiques sont traités comme des signaux différents.

Chaque signal logique est associé à un système de signalisation, qui définit si le signal transmet 
Chaque signal logique peut avoir un certain nombre de pilotes. Les 

### Signal non chargé

Un **signal non chargé** correspond à l'objet capable de transmettre de l'information au train. Les signaux non chargés portent :
 - un système de signalisation
 - des paramètres spécifiques à leur système de signalisation (comme `Nf` et `has_ralen30` pour bal)

Les signaux non chargés sont utilisés pour décrire statiquement l'infrastructure, et sont pensés pour être édités par l'utilisateur.

En fonction du contexte, différents mécanismes peuvent être à la source de cette information : ce sont des **pilotes** (`drivers`). Chaque signal peut porter plusieurs pilotes. Par exemple, un signal BAL qui est à la fois un départ de canton TVM et un départ de canton BAL aura deux pilotes: `bal-bal` et `bal-TVM`.

```yaml
{
    # signals must have location data.
    # this data is omited as its format is irrelevant to how signals behave

    "logical_signals": [
        {
            # the signaling system shown by the signal
            "signaling_system": "bal",
            # the settings for this signal, as defined in the signaling system manifest
            "settings": ["has_ralen30=true", "Nf=true"],
            # all the ways the signal can be driven
            "drivers": [
                # the signal can react to a following bal signal
                {"next_signaling_system": "bal"},
                # the signal can react to a following TVM signal
                {"next_signaling_system": "TVM"}
            ]
        }
    ]
}
```

```yaml
{
    # signals must have location data.
    # this data is omited as its format is irrelevant to how signals behave

    "logical_signals": [
        {
            # the signaling system shown by the signal
            "signaling_system": "bal",
            # the settings for this signal, as defined in the signaling system manifest
            "settings": ["has_ralen30=true", "Nf=true"],
            # all the ways the signal can be driven
            "drivers": [
                # the signal can react to a following bal signal
                {"next_signaling_system": "bal"}
            ]
        },
        {
            # the signaling system shown by the signal
            "signaling_system": "bapr",
            # all the ways the signal can be driven
            "drivers": [
                # the signal can react to a following bal signal
                {"next_signaling_system": "bapr"}
            ]
        }
    ]
}
```

Une chaine de charactère simplifiée de description du type de signal peut être généré. Ici: `bal[Nf=true,ralen30=true]+bapr`.

### Chargement des paramètres du signal

La première étape du chargement du signal est de charactériser le signal dans le système de signalisation.
Cette étape produit un objet qui décrit le signal.

Lors du chargement du signal :
 - le système de signalisation correspondant au nom fourni est identifié
 - les paramètres du signal sont chargés et validés suivant la spec du système de signalisation
 - le rôle de cantonnement du signal est évalué à partir de l'expression

Un objet de paramètres du signal est produit:

```rust
trait SignalSettings {
      fn is_block_boundary() -> bool;

      // field access APIs
}
```

### Chargement du signal

Une fois que les paramètres du signal sont chargés, il devient possible de charger ses pilotes. Pour chaque pilote :
 - l'implémentation du pilote est identifiée à partir de la paire `(signaling_system, next_signaling_system)`
 - on vérifie que le système de signalisation sortant du pilote correspond à celui du signal
 - on vérifie qu'il n'existe pas déjà de pilote pour le système de signalisation entrant du pilote

Cette étape produit une `Map<SignalingSystem, SignalDriver>`, où le système de signalisation est celui en entrée du signal.
Il devient ensuite possible de construire le signal chargé.

### Construction des cantons

 - le framework crée des cantons entre les signaux en suivant les routes présentes dans l'infrastructure, et les propriétés de cantonnement des signaux
 - des vérifications sont faites sur le graphe de cantons créé : il doit toujours pouvoir être possible de choisir un canton pour chaque signal et chaque état de l'infrastructure

### Limites de vitesse

Les limites de vitesse sont représentées comme des ranges sur des itinéraires.
Elles commencent leur vie comme des ranges sur des track sections, et sont liftées en ranges sur des itinéraires de la manière suivante :
 - Les limites de vitesse directionnelles par track sont remontées sur les itinéraires. La même limite de vitesse peut être sur plusieurs itinéraires.
 - Pour chaque limite de vitesse, le graphe des itinéraires est parcouru à l'envers à la recherche de signaux capable de gérer la limite :
    - Seules les limites de vitesse qui ne sont pas précédées par une autre limite aux propriétés identiques sont prises en compte
    - Chaque signal doit signaler son intérêt par rapport à une limite de vitesse: Pas concerné, Concerné mais devant être annoncé par un autre signal, ou concerné et terminal.
 - pour chaque limite de vitesse prévue sur le chemin du train, les signaux dans la chaîne d'annonce sont ajoutés à la liste de ceux qui seront simulés pour le train

```rust
enum SpeedLimitHandling {
    /** This signal isn't supposed to announce this limit */
    Ignore,
    /** This signal should announce this limit, but cannot */
    Error,
    /** This signal can announce this limit, and is part of an ongoing chain */
    Chain,
    /** This signal can announce this limit, and ends the chain */
    EndChain,
}

fn handles_speed_limit(
   self: SignalSettings,
   speed_limit: SpeedLimit,
   distance_mm: u64,
) -> SpeedLimitHandling;

fn handles_speed_limit_chain(
   self: SignalSettings,
   speed_limit: SpeedLimit,
   chain_signal: Signal,
   distance_mm: u64,
) -> SpeedLimitHandling;
```

### Validation des cantons

La validation permet de signaler des configurations invalides en terme de signalisation et de cantonnement.
Les cas de figure de validation que l'on souhaite supporter sont les suivants:
 - le système de signalisation peut vouloir valider, sachant si le canton pars / se termine sur un butoir :
   - la longueur du canton
   - l'espacement entre les signaux du canton, premier signal exclu
 - le signal d'entrée de canton, s'il existe, peut avoir des informations particulières sur la validité d'un canton s'il est un signal de transition

En pratique, il existe deux mécanismes distincts pour répondre à ces deux besoins :
 - le **module de système de signalisation** s'occupe de valider la signalisation **dans le canton**
 - le **pilote du signal d'entrée**, s'il existe, s'occupe de valider la **transition entre cantons**

```rust
extern fn report_warning(/* TODO */);
extern fn report_error(/* TODO */);

struct Block {
   startsAtBufferStop: bool,
   stopsAtBufferStop: bool,
   signals: Vec<SignalSettings>,
   signalPositions: Vec<Distance>,
   length: Distance,
}

/// Runs in the signaling system module
fn check_block(
   block: Block,
);


/// Runs in the signal driver module
fn check_entry_signal(
   entry_signal: SignalSettings,
   block: Block,
);
```

### Cycle de vie des signaux

Avant le départ d'un train:
 - le chemin d'un train peut être exprimé soit en routes soit en cantons. Ces deux chemins doivent être superposés
 - la file de signaux que le train va rencontrer est établie

Lors de la simulation :
 - au fil du déplacement du train, les informations d'occupation des voies devant lui sont synthétisées
 - lorsqu'un train observe un signal, son état est évalué

### Évaluation de l'état des signaux

Les signaux sont modélisés comme une fonction d'évaluation, qui consomme les paramètres pouvant influencer son comportement, et retourne l'état actuel du signal.

La fonction d'évaluation prend en paramètres, la vue est choisie pour le moment, car plus flexible.

```kotlin

enum ZoneStatus {
   /** The zone is clear to be used by the train */
   CLEAR,
   /** The zone is occupied by another train, but otherwise clear to use */
   OCCUPIED,
   /** The zone is incompatible. There may be another train as well */
   INCOMPATIBLE,
}

interface MAView {
    /** Combined status of the zones protected by the current signal */
    val protectedZoneStatus: ZoneStatus
    val nextSignalState: SignalState
    val nextSignalSettings: SignalSettings
}

interface DirectSpeedLimit {
    /** Distance between the signal and the speed limit */
    val distance: Distance
    val speed: Speed
}

interface IndirectSpeedLimit {
    val distanceToNextSignal: Distance
    val nextSignalState: SignalState
    val nextSignalSettings: SignalSettings
}

interface SpeedLimitView {
    /** A list of speed limits directly in front of the signal */
    val directSpeedLimits: List<DirectSpeedLimit>
    /** A list of speed limits which need to be announced in a signal chain */
    val indirectSpeedLimits: List<IndirectSpeedLimit>
}

fun signal(maView: MAView?, limitView: SpeedLimitView?): SignalState {
    // ...
}
```

La vue doit permettre d'accéder aux données suivantes :
 - une synthèse de l'état des zones en aval jusqu'à la MA du train
 - la chaine de cantons
 - l'état des signaux en aval présents dans la chaine de cantons du train

#### Chemin de la vue signalisation

Le chemin de la vue signalisation est exprimé en cantons :
 - des cantons peuvent être rajouter pour étendre la vue
 - la vue peut être réduite en supprimant des cantons

#### Simulation hors chemin du train

Il est possible de simuler la signalisation hors du chemin du train :
 - si un signal donne sur des cantons empruntant des chemins différents, il est simulé comme s'il était en bout d'itinéraire, et sera donc au carré
 - si un signal donne sur des cantons empruntant le même chemin, il est simulé avec les autres signaux de la suite, dans une vue construite à cet effet

## Dépendances

- `statique` graphe des routes, pour pouvoir créer des cantons
- `statique` les signaux, leur type et détecteur + direction associé
- `statique` les propriétés de cantonnement pour chaque signal
- `dynamique` observer l'**état des zones**

## Opérations

- **instancier une vue** crée un cadre dans lequel observer des signaux
- **prévoir le chemin** signaler à la vue les cantons qui seront empruntés par le train
- **observer un signal** s'abonner à l'état d'un signal (via la vue)
- **dépasser un signal** signaler qu'un signal a été dépassé par le train (via la vue)


## Annexes

### Questions de recherche

- est-ce qu'il existe des cantons qui chevauchent une fin de route ? non (loic)
- est-ce qu'il existe des existe des signaux LL(2) ? non en france
- est-ce qu'il existe des signaux qui changent de comportement en fonction du canton actif devant eux ? oui, pour les ralentissements
- est-ce qu'il existe des signaux qui sont le départ de cantons de types différents (bal et bapr par exemple) ? OUI LOL, tvm meme
- est-ce que le comportement d'un signal peut déprendre de quel canton est actif après le signal de fin du canton actuel ? oui, avec les ralentissements ou jaune cli

- est-ce que certains de signalisation ont besoin d'avoir des informations supplémentaires dans les cantons ? mouais, y'a des ralentissements, mais c'est pas spécialement porté par le canton
- est-il nominal qu'un train aie plusieurs systèmes de signalisation actifs simultanément ? non

- quand et par qui les cantons sont-ils générés ?
- quelles sont les données nécessaires à la génération des cantons ?
