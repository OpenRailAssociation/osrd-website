---
title: STDCM search environment configuration
linkTitle: STDCM search environment configuration
weight: 10
description: How to configure the STDCM search environment
---

In order for the STDCM tool to function, you'll need to setup the STDCM Search Environment, a configuration stored in database.

The configurable fields are as such:
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

This configuration is queried by the frontend. 
That way, the right objects and time bounds are used transparently by the user.

In order to setup this config, you can either 
* Use the provided REST API (see [the editoast openAPI]({{< ref "/docs/reference/apis/editoast#operations-tag-stdcm_search_environment" >}}) 
in the stdcm_search_environment section)
* Use the provided editoast cli (run `editoast stdcm-search-env help` for more information)
