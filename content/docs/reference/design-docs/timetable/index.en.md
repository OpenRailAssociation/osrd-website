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
labels: ["tchou-tchou", "choo-choo"]

# used to select speed limits for simulation
speed_limit_tag: "MA100"

# the start time is an ISO 8601 datetime with timezone. it is not always the
# same at the departure time, as there may be a stop at the starting point
start_time: "2023-12-21T08:51:11.914897+00:00"

path:
 - {id: a, uic: 87210} # Any operational point matching the given uic
 - {id: b, track: foo, offset: 1000} # 10m on track foo
 - {id: c, deleted: true, trigram: ABC} # Any operational point matching the trigram ABC
 - {id: d, operational_point: X} # A specified operational point

# the algorithm used for distributing margins and scheduled times
constraint_distribution: MARECO # or LINEAR

# all durations and times are specified using ISO 8601
# we don't supports months and years duration since it's ambiguous
# times are defined as time elapsed since start. Even if the attribute is omitted,
# a scheduled point at the starting point is infered to have departure=start_time
# the "locked" flag is ignored by the backend.
# To force stop-signal on stop's arrival, you can use the "on_stop_signal" flag.
schedule:
 - {at: a, stop_for: PT5M, locked: true} # infered arrival to be equal to start_time
 - {at: b, arrival: PT10M, stop_for: PT5M}
 - {at: c, stop_for: PT5M}
 - {at: d, arrival: PT50M, locked: true, on_stop_signal: true}

margins:
  # This example encodes the following margins:
  #   a --- 5% --- b --- 3% --- d

  # /!\ all schedule points with either an arrival or departure time must also be
  # margin boundaries. departure and arrival waypoints are implicit boundaries. /!\
  # boundaries delimit margin sections. A list of N boundaries yields N + 1 sections.
  boundaries: [b]

  # the following units are supported:
  #  - none is a special value which indicates no margin. It's the default
  #  - % means added percentage of the base simulation time
  #  - min/km means minutes per kilometers
  values: ["5%", "3%"]

# train speed at simulation start, in meters per second.
# must be zero if the train starts at a stop
initial_speed: 2.5

power_restrictions:
 - {from: b, to: c, value: "M1C1"}

comfort: AIR_CONDITIONING # or HEATING, default STANDARD

options:
  # Should we use electrical profiles to select rolling stock speed effort curves
  use_electrical_profiles: true
```


# Combining margins and schedule

Margins and scheduled points are two ways to add time constraints to a train's schedule.
Therefore, there most be a clear set of rules to figure out how these two interfaces interact.

The end goal is to make the target schedule and margins consistent with each other. This is achieved by:

 - computing what the schedule would look like if only margins were applied
 - compare that to the target schedule
 - correct the margin schedule so that it matches the target schedule

The path is partitionned as follows:

 - **known time sections** span between locations where the arrival time is known.
   If there are `N` such locations, there are `N - 1` known time sections.
   In these sections, margins need to be adjusted to match the target schedule.
 - If the arrival time at destination is unknown, the section from the last known
   arrival time point and the destination is called the **relaxed time section** has no bound.
   Margins can be applied directly.

As **margins cannot span known time section boundaries**, each known time section can be
further subdivided into margin sections. Margins cover the entire path.

**The end goal is to find the target arrival time at the end of each margin section**.
This needs to be done while preserving consistency with the input schedule.

![Schedule building algorithm](schedule.svg)

The final schedule is computed as follows:

 - A **base simulation** is computed, without any time constraint (other than stops). It's used to compute provisional margin values.
 - Make a **provisional time table**, which ignores target arrival times but includes provisional margin values.
 - For each **known time section**, compute the adjustment required to make the provisional schedule match the target schedule.
 - Distribute this difference into the known time section's margin sections, proportionally to margin section running time.
   After distributing the adjustment into margin sections, the **final schedule** should be compatible with the target schedule.

## Error handling

Some errors may happen while building the timetable:

 - if a known time section's required adjustment is negative, a warning must be raised, as margins will have to be lowered
 - if a margin section's final running time is tighter than the base simulation, it cannot be achieved, and a warning should be raised

Other errors can happen at runtime:

- target margin values can be too low, as transitions from high density margin to low margin section force the train to loose
  time after it has exited to high density margin section.
- target margin values can also be too high, as the train may not have time to slow down enough, or drive so slow as to be
  unacceptable.

During simulation, **if a target arrival time cannot be achieved, the rest of the schedule still stands**.


## Endpoints

### Timetable

```
POST /v2/timetable
GET /v2/timetable/ # Paginated list timetable
PUT /v2/timetable/ID
DELETE /v2/timetable/ID
GET /v2/timetable/ID # Timetable with list of train schedule ids attached to it
```

### Train Schedule

```
POST /v2/timetable/ID/train_schedule # A batch creation
GET /v2/train_schedule/ID
PUT /v2/train_schedule/ID # Update a specific train schedule
DELETE /v2/train_schedule # A batch deletion
```

### Path

```
POST /v2/infra/ID/pathfinding/topo # Not required now can be move later
POST /v2/infra/ID/pathfinding/blocks
# takes a pathfinding result and a list of properties to extract
POST /v2/infra/ID/path_properties?props[]=slopes&props[]=gradients&props[]=electrifications&props[]=geometry&props[]=operational_points
GET /v2/train_schedule/ID/path?infra_id=42 # Retrieve the path from a train schedule
```

### Simulation results

```
# Retrieve the list of conflict of the timetable (invalid trains are ignored)
GET /v2/timetable/ID/conflicts?infra=N
# Retrieve the space, speed and time curve of a given train
GET /v2/train_schedule/ID/simulation?infa=N
# Retrieves simulation information for a given train list. Useful for finding out whether pathfinding/simulation was successful.
GET /v2/train_schedule/simulations_sumary?infa=N&ids[]=X&ids[]=Y
# Projects the space time curves and paths of a number of train schedules onto a given path
POST /v2/train_schedule/project_path?infra=N&ids[]=X&ids[]=Y
```
