---
title: "The actual pathfinding"
linkTitle: "6 - The actual pathfinding"
weight: 60
---

Once we have a graph that describes the entire search space,
we can run a pathfinding algorithm. In this case, we use an
[A*](https://en.wikipedia.org/wiki/A*_search_algorithm).

We need to define a few things first:
* How to sort the nodes, which defines which solution is considered better than the other
* How to identify redundant nodes
* How to estimate the remaining "cost" at any given point
  (the heuristic)

### Node ordering

We currently define a hierarchy across different criteria:
we first compare the most important one, and move on
to the next if equal, until we reach the end of the list.

That order is defined in [STDCMNode](https://github.com/OpenRailAssociation/osrd/blob/dev/core/src/main/kotlin/fr/sncf/osrd/stdcm/graph/STDCMNode.kt),
in `compareTo`. It tends to change more often than this website
is updated, so it's best to check the code itself.

The main criteria is the best possible total travel time:
the sum of the current travel time to reach this node and the
minimum remaining travel time from this node to the destination
(as defined/computed by the heuristic).
Stop duration isn't included here.


### Defining redundant (visited) nodes

This is handled by [VisitedNodes](https://github.com/OpenRailAssociation/osrd/blob/dev/core/src/main/kotlin/fr/sncf/osrd/stdcm/graph/visited_node_tracking/VisitedNodes.kt).

The idea is that, at any given physical location, we mark
time ranges as "visited".

For example: consider a node reached at earliest t=10:00,
where we can delay the departure by 30 minutes, and we
can't add any engineering allowance (added time by slowing down).
Then the location will be flagged as "visited" from t=10:00 to t=10:30.

Engineering allowance means we can also reach some other time range
by lengthening the travel time. But it may not be the optimal
way to reach a given time. So we can mark a range as "conditionally visited",
where it's visited at a given cost value. These ranges are
compared to the new range and cost to identify if the new node is redundant.


### Heuristic

Most of the algorithmic complexity here comes from the high
number of nodes for any given location. Going through the
entire block graph once is comparatively quite fast.

So we go through the entire block graph, starting at the
destination, and we keep track of the fastest time it takes
to reach the destination from any given point.

We keep track of intermediate path steps, max speed, and
decelerations (including decelerations caused by requested stops).
But we can't consider accelerations at this stage.

It may sound slow and expensive (and it can be), but it drastically
lowers the standard deviation and upper bound in search time.
