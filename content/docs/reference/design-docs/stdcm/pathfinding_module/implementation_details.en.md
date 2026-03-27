---
title: "Implementation details and current issues"
linkTitle: "8 - Implementation details and current issues"
weight: 80
---


This page is about implementation details.
It isn't necessary to understand general principles,
but it helps before reading the code.

#### STDCMEdgeBuilder

This refers to
[this class](https://github.com/OpenRailAssociation/osrd/blob/dev/core/src/main/kotlin/fr/sncf/osrd/stdcm/graph/STDCMEdgeBuilder.kt)
in the project.

This class is used to make it easier to create instances of
`STDCMEdge`, the graph edges. These contain many attributes,
most of which can be determined from the context (e.g. the
previous node).
The `STDCMEdgeBuilder` class makes some parameters optional
and automatically computes others.

Once instantiated and parameterized, an `STDCMEdgeBuilder` has two methods:


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


{{% alert color="info" %}}
Note: ideally, we would have a class similar to `InfraExplorer`
that would just enumerate all possible simulations. It would be
much cleaner than this current state. See [this issue](https://github.com/OpenRailAssociation/osrd/issues/15685).
{{% /alert %}}


### Past path data

During the exploration, we simulate each block on its own, ignoring
where the train comes from. This is done to improve caching, and because
past path data is currently difficult to fetch.

This has two issues:

* We need to consider that speed limits apply until the train *head* leaves
  the speed limit range. This is technically wrong, it should be dismissed
  when the train *tail* leaves it.
* During the search, we don't know the slopes on the tracks still covered
  by the train. This can lead to accelerations that are too optimistic,
  and in rare cases to post-processing errors.

There's [an open issue](https://github.com/OpenRailAssociation/osrd/issues/14777),
but we don't have a clear plan nor the time to work on it (yet).
