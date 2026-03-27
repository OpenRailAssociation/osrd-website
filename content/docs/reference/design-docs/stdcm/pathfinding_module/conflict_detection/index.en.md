---
title: "Conflict detection"
linkTitle: "2 - Conflict detection"
weight: 20
---



Once we know what paths we can use, we need to know when they
can actually be used.

The [documentation]({{< ref "docs/reference/design-docs/conflict-detection" >}} "documentation")
of the conflict detection module explains how it's done internally.
Generally speaking, a train is in conflict when it has to slow down
because of a signal. In our case, that means the solution would not
be valid, we need to arrive later (or earlier) to see the signal
when it's not restrictive anymore.

In STDCM, conflicts can also be caused by work schedules.

The complex part is that we need to do the conflict detection *incrementally*
Which means that:
1. When running simulations up to t=x, we need to know all of the conflicts
   that happen before x, *even if they're indirectly caused by a
   signal seen at t > x* down the path.
2. We need to know the conflicts and resource uses right as they start
   even if their end time can't be defined yet.


For that to be possible, we need to know where the train will go
*after* the section that is being simulated (see
[infra exploration]({{< ref "docs/reference/design-docs/stdcm/pathfinding_module/infrastructure_exploration" >}} "infra exploration"):
we need some elements in the lookahead section).

To handle it, the conflict detection module
returns an error when more lookahead is required. When it happens
we extend it by cloning the infra explorer objects.


{{% alert color="info" %}}
Note to maintainers: the actual incremental conflict detection is handled
by the class `IncrementalConflictDetector`. When debugging in local,
it can be inspected and patched to identify exactly where requirements come from.
{{% /alert %}}
