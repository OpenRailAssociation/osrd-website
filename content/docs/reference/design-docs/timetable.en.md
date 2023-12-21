---
title: "Train schedule v2"
linkTitle: "Train schedule v2"
weight: 60
description: "Describes evolutions to the train schedule model"
---

# Train schedule v2

## Requirements

- `front`: easy to keep consistent during edition
- `front`: intermediate invalid states than can be reached during edition have to be encodable
- `front`: when deleting a waypoint that is referenced by margins, the position of the deleted waypoint within the path must be preserved until the situation is resolved
- `import`: path waypoint locations can be specified using UIC operational point codes
- `import`: support fixed scheduled arrival times at stops and arbitrary points
- `import` `edition`: train schedules must be self-contained: they cannot be described using the result of pathfinding or simulations

## Design decisions

### Path waypoints have an identity

At some point in the design process, the question was raised of whether to reference location of stops and margin transitions by name, or by value. That is, should stops hold the index of the waypoint where the stop occurs, or a description of the location where the stop occurs?

It was decided to add identifiers to path waypoints, and to reference those identifiers where referencing a path location is needed. This has multiple upsides:

- you can't reference a location outside of the path
- when changing a waypoint's location, for example from one station's platform to another, no additional maintenant work is needed to keep the path consistent
- if a path goes to the same place multiple times, the identifier reference makes it clear which path location is referenced
- it makes keeping data consistent while editing easier, as all locations are kept in a single place

### Invalid train schedules and soft deletes

If an user deletes a waypoint, what happens? Is it the front-end's responsibility to only save valid schedules, or can invalid schedules be represented in the data model? We decided that it wasn't just the front-end's responsibility, as we want to be able to model inconsistent states, until the user comes back to fix it.

One key observation was that don't want to loose the ability to locate within the path waypoints that were deleted, until all references are gone. How is the front-end supposed to display margin bounds or stops for a waypoint that's gone, if it's not there anymore?

We thus decided to add a `deleted` soft-delete flag to waypoints. When this flag is set, the back-end run simulations on the path, but still allows saving it. Once all references to a deleted waypoint are gone, it can be removed from the path. The backend can deny train schedules with stale deleted waypoints.

### Separating path and stops

This decision was hard to make, as there are little factors influencing this decision. Two observations led us to this decision:

- when deleting a waypoint, the end user may want to preserve the associated stop. Making the separation clear in the data model helps with implementing this behavior correctly, if deemed relevant
- bundling stops into the path makes it harder to describe what fields `path` waypoints should have, and what should have a separate object and reference. It was decided that keeping `path` a simple list of `Location`, with no strings attached, made things a little clearer.

### Arrival times are durations since departure time

- this allows shifting the departure time without having to change arrival times
- we don't have to parse dates and compute date differences within a single trip

We also discussed whether to use seconds or ISO 8601 durations. In the end, ISO 8601 was choosen, despite the simplicity of seconds:

- it preserves the user's choice unit for specifying duration
- it interfaces nicely with the ISO 8601 departure time
- it does not suffer from potential integer-float serialization related precision loss

## Creation fields

These fields are required at creation time, but cannot be changed afterwards.
They are returned when the train schedule is queried.

```yaml
timetable_id: 42
```

## Modifiable fields

```yaml
train_name: "ABC3615"
rolling_stock_name: R2D2

# labels are metadata. They're only used for display filtering
labels: ["INOUI", "TCHOU"]

# used to select speed limits for simulation
speed_limit_tags: ["MA100"]

# the departure time has to have a timezone
# all durations and times are specified using ISO 8601
departure_time: "2023-12-21T08:51:11.914897+00:00"

path:
 - {id: a, waypoint: true, uic: 87210}
 - {id: b, track: foo, offset: 10}
 - {id: c, deleted: true, waypoint: true, trigram: ABC}
 - {id: d, waypoint: true, track: toto, offset: 42}

engineering_margins:
 - {from: b, to: c, value: "2%", distribution: MARECO}

standard_margins:
  # the begin and end waypoints are always implicitly added
  distribution: MARECO
  intermediate_waypoints: [b]
  values: ["5%", "2%"]

# all durations and times are specified using ISO 8601
scheduled_points:
 - {at: a, arrival: PT0M, stop_for: PT5M}
 - {at: b, arrival: PT10M}
 - {at: c, arrival: PT25M}


# train speed at departure, in meters per second
initial_speed: 2.5

power_restrictions:
 - {from: b, to: c, value: "M1C1"}

comfort: AIR_CONDITIONING # or NONE

options:
  use_electrical_profiles: true
```

## Endpoints

```
POST /v2/timetable
DELETE /v2/timetable/ID
GET /v2/timetable/ID
GET /v2/timetable/ID/conflicts
# Projects the space time curves and paths of a number of train schedules onto the path of another one
GET /v2/timetable/ID/project_path?onto=X&ids[]=Y&ids[]=Z

POST /v2/train_schedule
GET /v2/train_schedule/ID
GET /v2/train_schedule/ID/path
PATCH /v2/train_schedule/ID
DELETE /v2/train_schedule/ID

POST /v2/infra/ID/pathfinding/topo
POST /v2/infra/ID/pathfinding/blocks

# takes a path (the output of pathfinding/blocks) and a list of properties that need extracting
POST /v2/infra/ID/path_properties?properties=slopes,gradients,electrification,neutral_sections
```


## Migration plan

### Phase 0

- Start the redesign the margin / power restrictions UI

### Phase 1

- core: Implement v2 pathfinding endpoints in core, without removing the old ones
- editoast: Implement the timetable v2 endpoints, and patch v1 endpoints to use the new model. As timetables currently are created automatically with scenarios, we can use this API to create new style timetables all the time.
- editoast: implement v2 pathfinding endpoints, without removing the old ones
- editoast: Implement v2 train schedule endpoints, extending existing tables: v1 endpoints still always work, and v2 endpoints work as long as the train schedule was created using v2 endpoints (we need to have the new-style path description). All train schedules still have a path ID, which can only be seen with the v1 API. For margins and power restrictions, a temporary unordered `path_offset` location type is used, and converted on the fly to a `track_offset` location type.

About 1 month

### Phase 2

- editoast: implement the new projection API (2 weeks)
- front: call train schedule v2 endpoints, but still use the old pathfinding endpoints (1 week)
- editoast: implement the new path properties electrification endpoints (1 week)
- front: migrate the power restriction selector to use the new path electrification properties endpoint, which does not need path IDs (1 week)
- editoast: implement path properties extractors, either in editoast directly or via core (decision needed) (2 weeks)

About 1 month

### Phase 3

- front: migrate the opendata import (2 weeks)
- front: use the new pathfinding call, which means there is no more path ID (2 weeks parallel)
- front: use the new projections API, which don't need path IDs (2 weeks parallel)
- front: use the new path properties API, which don't need path IDs either (2 weeks parallel)
- front: ensure all path IDs are gone (2 weeks parallel)
- editoast: remove the old style pathfinding result

About 1 month

### Phase 4

- front: implement the new margin / power restrictions UI (1 month)
- front: migrate away from path_offset locations
- editoast: remove the code which converts `path_offset` locations to `track_offset` locations

About 1 month

### Phase 5

- front: ensure no more v1 calls are left
- editoast: remove all v1 calls

About 2 weeks, very low intensity
