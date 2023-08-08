---
title: "Neutral Sections"
linkTitle: "Neutral Sections"
weight: 20
description: "Documentation about what they are and how they are implemented"
aliases:
    - ../neutral_sections
---

## Physical object to model

### Introduction
For a train to be able to run, it must either have an energy source on board (fuel, battery, hydrogen, ...) or be supplied with energy throughout its journey.

To supply this energy, electrical cables are suspended above the tracks: the *catenaries*. The train then makes contact with these cables thanks to a conducting piece mounted on a mechanical arm: the *pantograph*.

### Neutral sections
With this system it is difficult to ensure the electrical supply of a train continuously over the entire length of a line. On certain sections of track, it is necessary to cut the electrical supply of the train. These portions are called **neutral sections**.

Indeed, in order to avoid energy losses along the catenaries, the current is supplied by several substations distributed along the tracks. Two portions of catenaries supplied by different substations must be electrically isolated to avoid short circuits.

Moreover, the way the tracks are electrified (DC or not for example) can change according to the local uses and the time of installation. It is again necessary to electrically isolate the portions of tracks which are electrified differently. The train must also (except in particular cases) change its pantograph when the type of electrification changes.

In both cases, the driver is instructed to cut the train's traction, and sometimes even to lower the pantograph.  
In the French infrastructure, these zones are indicated by announcement, execution and end signs. They also carry the indication to lower the pantograph or not. The portions of track between the execution and end may not be electrified entirely, and may not even have a catenary (in this case the zone necessarily requires lowering the pantograph).  
*REV* (for reversible) signs are sometimes placed downstream of the end of zone signs. They are intended for trains that run with a pantograph at the rear of the train. These signs indicate that the driver can resume traction safely.

Additionally, it may sometimes be impossible on a short section of track to place a catenary or to raise the train's pantograph. In this case the line is still considered electrified, and the area without electrification (passage under a bridge for example) is considered as a neutral section.

### Rolling stock

After passing through a neutral section, a train must resume traction. This is not immediate (a few seconds), and the necessary duration depends on the rolling stock.

In addition, the driver must, if necessary, lower his pantograph, which also takes time (a few tens of seconds) and also depends on the rolling stock.

Thus, the coasting imposed on the train extends outside the neutral section, since these system times are to be counted from the end of the neutral section.

## Data model

We have chosen to model the neutral sections as the space between the signs linked to it (and not as the precise zone where there is no catenary or where the catenary is not electrified).

This zone is directional, *i.e.* associated with a direction of travel, in order to be able to take into account different placements of signs according to the direction. The execution sign of a given direction is not necessarily placed at the same position as the end of zone sign of the opposite direction.

For a two-way track, a neutral section is therefore represented by two objects.

The schema is the following

```json
{
    "lower_pantograph": boolean,
    "track_ranges": [
        {
            "track": string,
            "start": number,
            "end": number,
            "direction": enum
        }
    ],
    "announcement_track_ranges": [
        {
            "track": string,
            "start": number,
            "end": number,
            "direction": enum
        }
    ]
}
```
- `lower_pantograph`: indicates whether the pantograph should be lowered in this section
- `track_ranges`: list of track sections ranges where the train must not traction
- `announcement_track_ranges`: list of track sections ranges between the announcement sign and the execution sign

## Display

### Map
The zones displayed in the map correspond to the `track_ranges` of neutral sections, thus are between the execution and end signs of the zone. The color of the zone indicates whether the train must lower its pantograph in the zone or not.

The direction in which the zone applies is not represented.

### Simulation results
In the linear display, it is always the area between EXE and FIN that is displayed.

## Pathfinding
Neutral sections are therefore portions of "non-electrified" track where an electric train can still run (but where it cannot traction).

When searching for a path in the infrastructure, an electric train can travel through a track section that is not covered by the `track_ranges` of a catenary object (documentation to be written) only if it is covered by the `track_ranges` of a neutral section.

## Simulation

In our simulation, we approximate the driver's behavior as follows:
* The coasting is started as soon as the train's head passes the announcement sign
* The system times (pantograph reading and traction resumption) start as soon as the train's head passes the end sign.

In the current simulation, it is easier to use spatial integration bounds rather than temporal ones. We make the following approximation: when leaving the neutral section, we multiply the system times by the speed at the exit of the zone. The coasting is then extended over the obtained distance. This approximation is reasonable because the train's inertia and the almost absence of friction guarantee that the speed varies little over this time interval.

## Improvements to be made
Several aspects could be improved:

- We do not model the *REV* signs, all trains therefore only have one pantograph at the front in our simulations.
- System times are approximated.
- The driver's behavior is rather restrictive (coasting could start after the announcement sign).
- The display of the zones is limited: no representation of the direction or the announcement zones.
- These zones are not editable.

