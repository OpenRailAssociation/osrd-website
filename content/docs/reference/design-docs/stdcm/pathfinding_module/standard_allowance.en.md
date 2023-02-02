---
title: "Standard allowance"
linkTitle: "5 - Standard allowance"
weight: 50
---


The STDCM module must be usable with
[standard allowances]({{< ref "docs/explanation/running_time_calculation/allowances" >}} "marge de régularité").
The user can set an allowance value, expressed either as a function of
the running time or the travelled distance. This time must be added to the
running time, so that it arrives later compared to its fastest possible
running time.

> For example: the user can set a margin of 5 minutes per 100km.
> On a 42km long path that would take 10 minutes at best,
> the train should arrive 12 minutes and 6 seconds after leaving.

This can cause problems to detect conflicts, as an allowance would move
the end of the train slot to a later time.
The allowance must be considered when we compute conflicts as
the graph is explored.

The allowance must also follow the [MARECO](/pdf/MARECO.pdf) model:
the extra time isn't added evenly over the whole path,
it is computed in a way that requires knowing the whole path.
This is done to optimize the energy used by the train.

#### Linear margin expressed as a function of time

As a first step, the problem is solved with a linear margin,
i.e. added evenly over the whole path.
The speed is simply modified by a constant factor.

The [envelopes]({{< ref "docs/explanation/running_time_calculation/envelopes_system" >}} "envelopes").
computed during the graph traversal are not modified, they are always
at maximum speed. But they are paired with a speed factor, which is used
to compute running time and to evaluate conflicts.

The final envelope, with the allowance, is only computed once a path
is found.

#### Linear margin expressed as a function of distance

The principle is generally the same, but with an extra difficulty:
the speed factor isn't constant over the path.
When a train goes faster, it travels more distance in the same time,
which increases the allowance time and the speed factor.

Because the train speed changes over the path, the speed factor
changes from one edge to another. This causes irregular speed curves.

#### MARECO Allowances

This is exclusively a post-processing step,
because it isn't possible to compute the MARECO envelope
without knowing the full train path.
When looking for a path, linear allowances are used.

This means that conflicts may appear at this step.
To avoid them, the following procedure is applied:

1. A mareco allowance is applied over the whole path.
1. If there are conflict, the first one is considered.
1. The mareco allowance is *split in two intervals*.
The point where the first conflict appeared is set
to be at the same time as the envelope with a linear allowance,
removing the conflict at this point.
1. This process is repeated iteratively until no conflict is found.
