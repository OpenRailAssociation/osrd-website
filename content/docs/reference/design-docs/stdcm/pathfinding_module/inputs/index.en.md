---
title: "Input format"
linkTitle: "1 - Input format"
weight: 10
---

This module takes several parameters to find a path:

- A graph describing the physical infrastructure
- Unavailable sections in time intervals
- Origin and destination point(s)
- Departure time interval
- Maximum run time
- Simulation parameters (rolling stock, time step, allowances, ...)

Among those, the first 3 require more explanations.

#### Infrastructure graph

Today, the input graph is the `SignalingRoutes` graph.
But it can be any graph that represents the physical infrastructures
and the paths that can be used.

The only constraints are: the edges must have a length, and it must
be possible to compute running time on parts of an edge.

#### Unavailable sections

This input encodes the areas that are unavailable because of
capacity constraints.

Every edge has a set of "occupancy block". A block is made of these elements:
- Start offset
- End offset
- Start time
- End time

Offsets are relative to the start of the edge. Each block means that
the *head* of the train cannot be located in the edge
segment during the given interval.

These blocks include the grid margin. If the solution needs to have
an `x` seconds margin before the train passage, every block ends
`x` seconds later.

To give an example, with the following schedule, a 42m long train,
and 10m sight distance:

![Unavailable section example](unavailable_sections.svg)

- The occupancy of the block 1 from t=0 to t=300 makes it unavailable
in its entirety during this time
- The last 10 meters of block 1 are unavailable from t=300 to t=360,
because the signal at the start of block 2 must be green when the
conductor sees it. It is possible to consider that this unavailability block
starts at t=130 (when the next signal isn't green), as blocks can overlap.
- The occupancy of block 2 from t=130 to t=360 makes it unavailable
during this time. It is also unavailable from t=0, as the presence of a
train in this block would cause a warning on block 1.
- The first 42 meters of block 3 are unavailable from t=0 to t=360,
because the tail of the train must have left the block 2 at this time.
- The rest of block 3 is unavailable in its entirety from t=280 to t=360