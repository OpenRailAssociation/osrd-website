---
title: "Configuration de l'environnement de recherche STDCM"
linkTitle: "Configuration de l'environnement de recherche STDCM"
weight: 10
description: Comment configurer l'environnement de recherche STDCM
---

Pour que l'outil STDCM fonctionne, il faut configurer l'environnement de recherche STDCM, une configuration stockée en base de données.

Les champs configurables sont les suivants :
```rust
pub struct StdcmSearchEnvironment {
    pub infra_id: i64,
    pub electrical_profile_set_id: Option<i64>,
    pub work_schedule_group_id: Option<i64>,
    pub timetable_id: i64,
    pub search_window_begin: NaiveDateTime,
    pub search_window_end: NaiveDateTime,
}
```

Cette configuration est récupérée par le frontend afin que les bons objets et bornes temporelles soient utilisés 
de manière transparente par l'utilisateur.

Pour configurer cette environnement, vous pouvez soit :
* Utiliser l'API REST prévue à cet effet (voir [l'openAPI d'editoast]({{< ref "/docs/reference/apis/editoast#operations-tag-stdcm_search_environment" >}})
dans la section stdcm_search_environment)
* Utiliser le CLI editoast (exécutez `editoast stdcm-search-env help` pour plus d'informations)
