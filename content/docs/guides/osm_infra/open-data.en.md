---
title: "Working with OSM data"
linkTitle: "Working with OSM data"
weight: 10
description: Describe the problems and solutions related to working with OSM data using OSRD
---

### Problems

Some data is not available from OpenStreetMap (OSM), either because it's not public (like *signals* in France) or because it has not been collected in OSM yet (like *slopes*).

### OSM data in OSRD

The following list resumes the different objects used in OSRD, roughly sorted by their importance in the application.</br>
This gives an idea about their role in OSRD and how they are extracted (or not) from OSM.

| Data                  | Importance | Source |
|-----------------------|------------|--------|
| *Track sections*      | Required. This one's pretty obvious why. | Extracted from OSM ways with the tag [`railway=rail`](https://wiki.openstreetmap.org/wiki/Tag:railway%3Drail).​ |
| *Switches*            | Required. Tracks should be explicitly linked by switches to be connected. | Generated from the angle between the *track sections* that cross each other. A specific switch object exist in OSM but is not used because its quality is uneven.​ |
| *Signals*             | Required. Signals are used by the pathfinding and the conflict detection to determine where and how the trains can move on the infrastructure.| Either extracted from OSM nodes with the tag [`railway=signal`](https://wiki.openstreetmap.org/wiki/Tag:railway%3Dsignal), or generated using *track sections* data.​ |
| *Detectors*           | Required. Detectors are used in alongside of the signals for the pathfinding. | Generated from the *signals* data.​ |
| *Operational points*  | Almost required. Without it, most of the application feature will not work. | Extracted from OSM relations with the tag [`public_transport=stop_area`](https://wiki.openstreetmap.org/wiki/Tag:public_transport%3Dstop_area).​ |
| *Speed sections*      | Nice to have. If not defined, a track section has a speed limit of 80 km/h, which will impact the realism of the simulation. | Extracted from OSM tag [`maxspeed`](https://wiki.openstreetmap.org/wiki/Key:maxspeed).​ |
| *Electrifications*    | Nice to have. Electric rolling stocks are not be able to travel on non-electrified tracks. | Extracted from OSM tag [`voltage`](https://wiki.openstreetmap.org/wiki/Key:voltage).​ |
| *Loading gauges*      | Nice to have. If not defined, the least restrictive one is used, allowing the trains to run everywhere. | *Not* extracted, but the data exist (see OSM tag [`loading_gauge`](https://wiki.openstreetmap.org/wiki/Key:loading_gauge)).​ |
| *Slopes*              | Nice to have. If not defined, tracks are considered flat, which will impact the realism of the simulation. | This data doesn't exist in OSM. |
| *Curves*              | Nice to have. If not defined, tracks are considered straight, which will impact the realism of the simulation. | *Not* extracted. The data exist under another format that would be hard to extract. |
| *Level crossings*     | Nice to have. Level crossings do not affect the simulation or pathfinding, but their closing information can be analyzed. | *Not* extracted, but the data exist (see the OSM tag [`level_crossing`](https://wiki.openstreetmap.org/wiki/Tag:railway%3Dlevel_crossing)).​ |
| *Neutral zones*       | Nice to have. | We did not explored that yet. |

### Solutions

If *track sections* are missing from your data, there's not much we can do. However, this information is usually in very high quality in OSM because it can be traced using aerial imagery (track geometry can be sketchy in tunnels).
But for *signals*, a option in the infrastructure generation can be used for replacing the existing ones with [realisticaly generated *signals*](/en/docs/reference/design-docs/osm-to-railjson#signal-generation).

For the *operational points*, there are a few optional fields (*name*, *uic* and *local_track_name*) that we generate if they are missing to make them easier to use.
