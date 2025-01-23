---
title: "Speed limits"
linkTitle: "Speed limits"
weight: 30
description: "Describes how speed limits work"
---

## Description

Railway infrastructure has a surprising variety of speed limits:
 - some are known by the driver, and not announced at all
 - some are announced by fixed signs regardless of where the train goes
 - some are announced by fixed signs, depending on where the train path goes
 - some are announced by dynamic signals regardless of where the train goes
 - some are announced by dynamic signals, depending on where the train path goes

## Data model

```yaml
{
    # unique speed limit identifier
    "id": "...",

    # A list of routes the speed limit is enforced on. When empty
    # or missing, the speed limit is enforced regardless of the route.
    #
    # /!\ When a speed section is announced by signals, the routes it is
    # announced on are automatically filled in /!\
    "on_routes": ["${ROUTE_A}", "${ROUTE_B}"]
    # "on_routes": null, # not conditional
    # "on_routes": [], # conditional

    # A speed limit in meters per second.
    "speed_limit": 30,

    # A map from train tag to speed limit override. If missing and
    # the speed limit is announced by a signal, this field is deduced
    # from the signal.
    "speed_limit_by_tag": {"freight": 20},

    "track_ranges": [{"track": "${TRACK_SECTION}", "begin": 0, "end": 42, "applicable_directions": "START_TO_STOP"}],
}
```

## Design considerations

### Where to put the speed limit value

When a speed limit is announced by dynamic signaling, we may be in a position where speed limit value is duplicated:
 - once in the signal itself
 - once in the speed limit

There are multiple ways this issue can be dealt with:

#### {{< adopted >}} Mandatory speed limit value in the speed section

Upsides:
- simpler to implement, works even without train reactions to signals nor additional API

Downsides:
- more work on the side of users
- room for inconsistencies between the speed limit announced by signaling, and the effective speed limit

#### {{< rejected >}} Deduce the signal constraint from the speed limit

This option was not explored much, as it was deemed awkward
to deduce signal parameters from a speed limit value.

#### {{< rejected >}} Deduce the speed limit from the signal

Make the speed limit value optional, and deduce it from the signal itself.
Speed limits per tag also have to be deduced if missing.

Upsides:
 - less work for users
 - lessens the likelihood of configuration mismatches

Downsides:
 - not all signaling systems work well with this. It may be difficult to deduce the announced speed limit from a signal configuration, such as with TVM.
 - speed limits have to be deduced, which increases implementation complexity

### How to link announce signals and speed limit area

Speed limit announced by dynamic signaling often start being enforced at a specific location,
which is distinct from the signal which announces the speed limit.

To allow for correct train reactions to this kind of limits, a link between the announce signal
and the speed limit section has to be made at some point.

#### {{< rejected >}} Automated matching of signals and speed sections

Was not deemed realistic.

#### {{< rejected >}} Explicit link from route to speed limit and signals

Was deemed to be awkward, as signaling is currently built over interlocking.
Referencing signaling from interlocking creates a circular dependency between the two schemas.

#### {{< rejected >}} Explicit link from speed limit to signals

Add a list of `(route, signal)` tuples to speed sections.

Upside:
 - a link with the signal can be made with creating the speed section

Downside:
 - Creates a dependency loop between speed limits and signaling. Part of the parsing of speed limit has to be deferred.
 - Signals parameters also have to be set per route, which is done in the signal. Having per-route options on both sides doubles the work.


#### {{< rejected >}} Inlining speed limit definitions into signals

Introduces a new type of speed limit, which are announced by signals.
These speed limits are directly defined within signal definitions.

```yaml
{
    # ...
    "conditional_parameters": [
        {
            "on_route": "${ROUTE_ID}",
            "speed_section": {
                "speed_limit": 42,
                "begin": {"track": "a", "offset": 10},
                "end": {"track": "b", "offset": 15},
            },
            "parameters": {"rappel30": "true", "short_block": "true"}
        }
    ]
    # ...
}
```

Upsides:
 - straightforward infrastructure edition experience for speed sections announced by a single signal

Downsides:
 - creates two separate kinds of speed limits:
   - can cause code duplication
   - could make later changes of the data model trickier
   - it's unclear whether the criterion used to make this partition is appropriate
 - speed sections created directly inside signals can only be announced by a single signal, which could be an issue for speed sections which apply to very large areas, and are announced by multiple signals (such as one for each direction)
 - the cost of reversing this decision could be fairly high

#### {{< adopted >}} Explicit link from signal to speed section

```yaml
{
    # ...
    "conditional_parameters": [
        {
            "on_route": "${ROUTE_ID}",
            "announced_speed_section": "${SPEED_SECTION_ID}",
            "parameters": {"rappel30": "true", "short_block": "true"}
        }
    ]
    # ...
}
```
Upsides:
 - single unified way of declaring speed limits
 - very close to the current implementation

Downsides:
 - adds a level of indirection between the signal and the speed section
 - the edition front-end has to be smart enough to create / search speed sections from the signal edition menu

### Speed limits by route

Some speed limits only apply so some routes. This relationship needs to be modeled:

1) speed limits could have a list of routes they apply on
2) routes could have a list of speed limits they enforce
3) the routes a speed limit apply on could be deduced from its announce signals, plus an explicit list of routes per speed section

We took option 3.
