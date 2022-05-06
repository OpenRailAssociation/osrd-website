---
title: "Vue d'ensemble de l'architecture"
linkTitle: "Vue d'ensemble de l'architecture"
weight: 30
description: Description de l'architecture de l'application
---

```mermaid
flowchart TD
    front[front end]

    django-api[django api]
    editoast[editoast]
    chartos[chartos]

    core[core]

    pg[(postgres)]
    redis[(redis)]

    front -- various apis--> django-api
    front -- infrastructure edition --> editoast
    front -- mapbox layers --> chartos

    django-api --> core

    django-api --> pg
    chartos -- read only --> pg
    chartos -- stores cached tiles --> redis
    editoast -- writes --> pg
    editoast -- invalidates tiles --> chartos

    click front href "./#front" _self
    click django-api href "./#django-api" _self
    click editoast href "./#editoast" _self
    click chartos href "./#chartos" _self
    click core href "./#core" _self
```

# Le front-end (`front`) {#front}

TODO

# Le service d'API django (`api`) {#api}

TODO

# Le service d'édition (`editoast`) {#editoast}

TODO

# Le service de cartographie (`chartos`) {#chartos}

TODO

# Le service de simulation et de pathfinding (`core`) {#core}

TODO