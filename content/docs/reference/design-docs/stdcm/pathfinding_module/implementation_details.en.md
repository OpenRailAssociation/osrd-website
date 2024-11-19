---
title: "Implementation details"
linkTitle: "6 - Implementation details"
weight: 60
---


This page is about implementation details.
It isn't necessary to understand general principles,
but it helps before reading the code.

#### STDCMEdgeBuilder

This refers to
[this class](https://github.com/OpenRailAssociation/osrd/blob/dev/core/src/main/kotlin/fr/sncf/osrd/stdcm/graph/STDCMEdgeBuilder.kt)
in the project.

This class is used to make it easier to create instances of
`STDCMEdge`, the graph edges. Those contain many attributes,
most of which can be determined from the context (e.g. the
previous node).
The `STDCMEdgeBuilder` class makes some parameters optional
and automatically computes others.

Once instantiated and parametrized, an `STDCMEdgeBuilder` has two methods:


- `makeAllEdges(): Collection<STDCMEdge>` can be used to create all
the possible edges in the given context for a given route.
If there are several "openings" between occupancy blocks, one edge
is instantiated for each opening. Every conflict, their avoidance,
and their related attributes are handled here.

- `findEdgeSameNextOccupancy(double timeNextOccupancy): STDCMEdge?`:
This method is used to get the specific edges that uses a certain
opening (when it exists), identified here with the time of the next
occupancy block. It is called whenever a new edge must be re-created
to replace an old one. It calls the previous method.


### Pathfinding

The methods mentioned here are defined in
[this class](https://github.com/OpenRailAssociation/osrd/blob/dev/core/src/main/kotlin/fr/sncf/osrd/stdcm/graph/STDCMPathfinding.kt).

#### Cost function

The function used to define pathfinding cost sets which path
is used over another. The result is always the one that minimizes
this cost (as long as the heuristic is admissible).

Here, two parameters are used: total run time and departure time.
The latter has a very small weight compared to the former,
so that the fastest path is found. More details
are explained in the documentation of those methods.



#### Heuristics

The algorithm used to find a path is an A*, with a heuristic based
on geographical coordinates.

However, the coordinates of generated infrastructures are arbitrary
and don't reflect the track distance. It means that,
for the generated infrastructures, the path may not always be the
shortest one.

It would be possible to use this heuristic to determine whether
the current node can lead to a path that doesn't take
longer than the maximum allowed total run time. But for the same
reason, adding this feature would break any STDCM test on generated
infras. More details in
[this issue](https://github.com/OpenRailAssociation/osrd/issues/2818).

