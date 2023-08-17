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

    # A list of routes the speed limit is enforced on. When empty or missing,
    # the speed limit is enforced regardless of the route. If a signal announces
    # this speed section on a given route, it is automatically added to this list.
    "on_routes": ["${ROUTE_A}", "${ROUTE_B}"]

    # speed limit in meters per second
    "speed_limit": 30,
    # a map from train tag to speed limit override
    "speed_limit_by_tag": {"freight": 20},

    "track_ranges": [{"track": "${TRACK_SECTION}", "begin": 0, "end": 42, "applicable_directions": "START_TO_STOP"}],
}
```

## Design considerations

### Where to put the speed limit

When a speed limit is announced by dynamic signaling, we may be in a position where speed limit information is duplicated:
 - once in the signal itself
 - once in the speed limit

For example, we may have a `RR30` signal before a 30km/h speed limit. This is not great, and quite error prone.

There are three options:
1) accept it, and find a way to validate that both ends match
2) deduce the signal constraint from the speed limit
3) deduce the speed limit from the signal

We took option 1.

### How to link limits announce signals to speed limits

Speed limit announced by dynamic signaling often start being enforced at a specific location,
which is distinct from the signal which announces the speed limit.

To allow for correct train reactions to this kind of limits, a link between the announce signal
and the speed limit section has to be made at some point.

1) implicit link, automatic match of signals and speed limits
2) explicit link in the speed limit (list of signals)
3) explicit link in the signal (single optional speed limit per signal)
4) explicit link in the route, alongside the speed limit (list of signal + speed limit tuples)

We took option 3.

### Speed limits by route

Some speed limits only apply so some routes. This relationship needs to be modeled:

1) speed limits could have a list of routes they apply on
2) routes could have a list of speed limits they enforce
3) the routes a speed limit apply on could be deduced from its announce signals, plus an explicit list of routes per speed section

We took option 3.
