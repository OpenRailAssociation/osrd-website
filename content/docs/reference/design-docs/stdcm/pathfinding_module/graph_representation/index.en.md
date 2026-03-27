---
title: "Search space and decision tree"
linkTitle: "2 - Search space and decision tree"
weight: 20
---

Now that we can enumerate the paths and identify conflicts, we need
to build the final decision tree that avoids all conflicts.

{{% alert color="info" %}}
In terms of implementation, we would like to have a class with a similar
purpose as `InfraExplorer`, but currently it's all over the place.
There's [a refactoring issue](https://github.com/OpenRailAssociation/osrd/issues/15685),
but we may not have the time to do it.
{{% /alert %}}

The search space is described as a graph with nodes and edges.
Edges are generally one signaling block long, but may be shorter
in case of stops.

Generating new edges on a given path follow this sequence:

1. The train movement is generated on the new segment (time and speed at each point)
2. Conflicts are identified during this time segment
3. *Openings* are identified
4. One edge is generated per opening

An "opening" is an available time window between two occupied blocks.
When there are several different openings, we get to chose if the
new train goes before or after another train or work schedule.

### Delays

We often need to **add delay** to the current simulation to actually go
through an opening, where the train needs to reach a point later than it could have.

This can be done in several different ways:

* Delaying the train departure
* Lengthening a stop
* Forcing the train to go slower for a while (with something called "engineering allowances")

We keep track of how much delays we can add at any given point to handle
departure and stop changes. For engineering allowances, we're identifying
how much delay we can add if the train slows down then immediately speeds up.

