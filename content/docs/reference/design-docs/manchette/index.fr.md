---
title: "Manchette"
linkTitle: "Manchette"
weight: 60
description: "Description du design de la manchette"
---


## Prérequis

- Pouvoir créer une manchette à partir d'une liste de PR
- Pouvoir créer une manchette à partir d'un train
- Pouvoir utiliser une manchette sur des infrastructures différentes
- Pouvoir configurer l'affichage de la manchette et que ce soit sauvegardé entre les utilisateurs

### Questions?

- Quelle manchette prendre au début ?
  - Proposition: Un train, cela implique d'avoir des manchettes éphémères.
- Une manchette créée via un train: Qui porte l'information du chemin ?
  - Proposition: on copie les informations du train pour créer l'objet.
- Overlapp des stretching ?
  - On peut créer un overlapp (en modifiant l'infra par exemple)
  - Si un overlapp à lieu comment c'est géré par le front ? (Il ignore ?, il supprime ?)


## Workflow

```mermaid
flowchart TD
    %%%% NODES

    manchette[Configuration de la manchette]
    style manchette fill:#b697e6
    %% ↓
    path[Chemin]
    style path fill:#bada55,stroke:#a7c44c
    %% ↓
    path_properties[Propriété du chemin]
    style path_properties fill:#bada55,stroke:#a7c44c
    %% ↓
    train_projection[Projection des trains]
    style train_projection fill:#bada55,stroke:#a7c44c
    %% ↓
    manchette_component[Composant Manchette]
    %% ↓
    space_time_chart[GET]

    %%%% EDGES

    manchette -- Calcul --> path
    path -- Calcul des propriétés --> path_properties
    path -- Calcul --> train_projection
    path_properties -- Déclivités + PR --> manchette_component
    manchette -- Extraction des préférences de visualisation --> manchette_component
    train_projection -- Données --> space_time_chart
    manchette_component -- Configuration --> space_time_chart
```

## Schéma

```yaml
name: Ma manchette
path:
  - { uic: 87210 } # Any operational point matching the given uic
  - { track: foo, offset: 10000 } # 10m on track foo
  - { trigram: ABC } # Any operational point matching the trigram ABC
  - { operational_point: 35f57ee0-4e67-4cf7-9946-0c6be757ef85 } # A specified operational point
operational_point_settings:
  35f57ee0-4e67-4cf7-9946-0c6be757ef85: # ID of an operational point
    bold: true
    hidden: false
zones:
  - start: 35f57ee0-4e67-4cf7-9946-0c6be757ef85
    end: 30e97a0a-ce2a-4727-8eba-038fba1a6671
stretching:
  - start: 35f57ee0-4e67-4cf7-9946-0c6be757ef85
    end: 30e97a0a-ce2a-4727-8eba-038fba1a6671
    factor: 1.5
```

## Endpoints

```
// TODO
```
