---
title: "osm-to-railjson"
linkTitle: "osm-to-railjson"
weight: 10
description: Generating an infrastructure from OpenStreetMap data
---

## **Summary**

Here are the step involved in [osm-to-railjson](https://github.com/OpenRailAssociation/osrd/tree/dev/editoast/osm_to_railjson):

- [Graph](#graph)
- [Tracks sections](#tracks-sections)
- [Switches and buffer stops](#switches-and-buffer-stops)
- [Speed sections](#speed-sections)
- [Electrifications](#electrifications)
- [Operational points](#operational-points)
- [Signals](#signals)
- [Detectors](#detectors)
- [Routes](#routes)

### **Graph**

To create a graph from the OSM nodes and ways, [osm4routing](https://github.com/rust-transit/osm4routing2) is used.

### **Tracks sections**

Create a *track section* per edge.

### **Switches and buffer stops**

We use the graph topology to deduce the *switches* and the *buffer stops*.
For example, if a node has only one edge, it must be a *buffer stop*.
But if it has 4 edges, it must be either a *cross switch* or a *double slip switch*.

To decide between the last two cases (and in other cases as well), the information of which edges are connected to one another is required.
This connection is called a branch.
The angle between two edges allows to determine if two edges are linked. If two edges have an angle less then 30°, they are considered linked.
In the previous example with 4 edges, if there is 2 branches, it's a *cross switch*, but if there is 4 branches, it's a *double slip switch*.
This method may result in false positive branching when 2 *track sections* have a small angle but are not actually linked.

### **Speed sections**

Create one *speed section* or more by reading the `maxspeed`, `maxspeed:forward` and `maxspeed:backward` tags on each edge.

### **Electrifications**

Create an *electrification* section by reading the `voltage` tag on each edge.

### **Operational points**

For each relation with the tag `public_transport=stop_area`, iterate over its node members with the role `stop`.
They will form the parts of the *operational points*.
Then retrieve the *main_code*, *name* and *uic* from the `railway:ref`, `name` and `uic_ref` tags respectively.

The properties *name*, *uic* and *local_track_name* are generated if they are missing from OSM.

### **Signals**

There are two different ways: extraction from OSM or generation from scratch.

#### Extraction

Create a *signal* for each OSM node with either the tag `railway:signal:main` or `railway:signal:combined`.

#### Generation

Different types of signals can be generated:

- **Intersection**: *signals* protecting intersections
- **BAL**: block signalling using BAL ([Block Automatique Lumineux](https://en.wikipedia.org/wiki/Automatic_block_signaling))
- **TVM**: block signalling using TVM ([Transmission Voie-Machine](https://en.wikipedia.org/wiki/Transmission_voie-machine))

The rules used for generation are:

- For **intersections**:
  - Any *switches* less than 500 meters apart are considered to be part of the same **intersection**.
  - *Signals* are placed on each *track section* leading to the **intersection**, 100 meters ahead of the *switch*.
- For **blocks**:
  - To determine the length of each **block**, this [formula](https://en.wikipedia.org/wiki/Braking_distance#Total_stopping_distance) is used:
    ```
    (v² / 2 * a + rt * v) * m
    ```
    With:
    - `v` => the *speed limit* of the *track sections*.
    - `a` => the *deceleration* of the rolling stock ([realistic rolling stocks](/en/docs/explanation/models/realistic-rolling-stocks/) from open data are used).
    - `rt` => the *reaction time* of the driver (5 seconds).
    - `m` => a *safety margin* (+20%)

{{% alert color="warning" %}}
Due to an error in the route generations, each signal is forced to have its sibling in the opposite direction. 
Meaning that all tracks are two-way. We are currently working to fix this bug.
{{% /alert %}}

### **Detectors**

One detector is created for each signal, located at exactly the same place.

### **Routes**

The route generation is achieved in two steps.
First, determine all the nodes that will make up the graph. These will be all the *buffer stops*, all the *switches* and one *signal* per direction per *track section*.
Then, for each node, travel along every track starting from it, and stop at the first other node you find. This will be all the possible routes from one node.
And combining the ones from every nodes will create the graph of all possible routes.
