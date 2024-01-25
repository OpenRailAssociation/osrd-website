---
title: "Timetable v2"
linkTitle: "Timetable v2"
weight: 60
description: "Describes evolutions to the new **timetable** and **train schedule** models"
---

![Test](timetable.svg)

##  Design decisions

Some major changes were made between our first version of the timetable and the new one:

- Isolate the timetable table. It can be used in a scenario or in other contexts
- Have a soft reference from train schedule to rolling stock (to be able to create a train schedule with unknown rolling stock)
- Consider path and simulation output as cache (that don't require to be stored in DB)
- We can compute pathfinding without having to store data
- All input needed to compute a path is stored in the train schedule (we can recompute it if needed)
- All input needed to run a simulation is stored in the train schedule (we can recompute it if needed)

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


### No more engineering margins?

In the legacy model, we had engineering margins. These margins had the property of being able to overlap. It was also possible to choose the distribution algorithm for each margin individually.

We asked users to comment on the difference and the usefulness of retaining these margins with scheduled points. The answer is that there is no fundamental difference, and that the additional flexibility offered by engineering margins makes no pratical sense (overlap and choice of distribution...).

### Arrival times are durations since departure time

- this allows shifting the departure time without having to change arrival times
- we don't have to parse dates and compute date differences within a single trip

We also discussed whether to use seconds or ISO 8601 durations. In the end, ISO 8601 was choosen, despite the simplicity of seconds:

- it preserves the user's choice unit for specifying duration
- it interfaces nicely with the ISO 8601 departure time
- it does not suffer from potential integer-float serialization related precision loss


### Invalid and outdated train schedules

Reasons for a train schedule to be **invalid**:

- Inconsitent train schedule (contains deleted waypoint)
- Rolling stock not found
- Path waypoint not found
- The path cannot be found

Reasons for a train schedule to be **outdated**:

- The train path changed
- The train running time changed

What we can do about outdated trains:

1. Nothing, they're updated without notification
2. We can notify the user that a train schedule is outdated:
    - Nothing can be done except acknoledge the change
    - We can not check what changed between the old and new version
    - We can not know the cause of this change (RS, Infra, Algorithms...)

Note: The outdated status is a nice to have feature (it won't be implemented right now).

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

# the algorithm used for computing the standard margins AND scheduled points
distribution_margins: MARECO

standard_margins:
  # the begin and end waypoints are always implicitly added
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

POST /v2/train_schedule # Can be a batch creation
GET /v2/train_schedule/ID
GET /v2/train_schedule/ID/path?infra_id=42
PATCH /v2/train_schedule/ID
DELETE /v2/train_schedule/ID

POST /v2/infra/ID/pathfinding/topo # Not required now can be move later
POST /v2/infra/ID/pathfinding/blocks

# takes a path (the output of pathfinding/blocks) and a list of properties that need extracting
POST /v2/infra/ID/path_properties?properties=slopes,gradients,electrification,neutral_sections,geometry
```

## Migration plan

### Phase 1

Front:

- Design margin interface and scheduled points

Back:

- Create new tables and associated models (using ModelV2)
- Implement GET / DELETE / POST / PATCH endpoints for these new models

### Phase 2

Front (using legacy train schedules):

- Adapt margin interface to the new design
- Handle scheduled points

Back:

- Implement pathfinding endpoint
- Implement path endpoint of a `train_schedule`

### Phase 3

Front (start using the new train schedule model):

- Handle pathfinding separated from the train schedule
- Handle invalid rolling stocks

Back:

- Move and adapt `project_path` endpoint
- Move `conflicts` endpoint
- Move and adapt STDCM endpoint
- Adapt timetable import with new endpoints

### Phase 4

Back:

- Remove legacy endpoints and tables and models
