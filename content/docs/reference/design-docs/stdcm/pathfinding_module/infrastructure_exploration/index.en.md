---
title: "Infrastructure exploration"
linkTitle: "1 - Infrastructure exploration"
weight: 10
---

The first thing we need to define is *how we move through the infrastructure*,
without dealing with conflicts yet.

We need a way to define and enumerate the different possible paths and
explore the infrastructure graph, with several constraints:
1. The path must be compatible with the given rolling stock
   (loading gauge / electrification / signaling system)
2. At any point, we need to access path properties from its start up to the
   considered point. This includes block and route lists.
3. We sometimes need to know where the train will go *after* the
   point currently being evaluated, for proper conflict detection



To do this, we have defined the class `InfraExplorer`. It uses blocks
(sections from signal to signal) as a main subdivision.
It has 3 sections: the current block, predecessors, and a "lookahead".


![InfraExplorer structure](infra_explorer.svg)


In this example, the green arrows are the predecessor blocks.
What happens there is considered to be immutable.

The red arrow is the current block. This is where we run
train and signaling simulations, and where we deal with conflicts.

The blue arrows are part of the lookahead. This section hasn't
been simulated yet, its only purpose is to know in advance
where the train will go next. In this example, it would tell us
that the bottom right signal can be ignored entirely.
The top path is the path being currently evaluated.
**The bottom section of the path will be evaluated in a different
and already instantiated `InfraExplorer`**


The `InfraExplorer` is manipulated with two main functions
(the accessors have been removed here for clarity):

```kotlin
interface InfraExplorer {
    /**
     * Clone the current object and extend the lookahead by one route, for each route starting at
     * the current end of the lookahead section. The current instance is not modified.
     */
    fun cloneAndExtendLookahead(): Collection<InfraExplorer>

    /**
     * Move the current block by one, following the lookahead section. Can only be called when the
     * lookahead isn't empty.
     */
    fun moveForward(): InfraExplorer
}
```

`cloneAndExtendLookahead()` is the method that actually enumerates the
different paths, returning clones for each possibility.
It's called when we need a more precise lookahead to properly identify
conflicts, or when it's empty and we need to move forward.

A variation of this class can also keep track of the train simulation
and time information (called `InfraExplorerWithEnvelope`).
This is the version that is actually used to explore the infrastructure.
