---
title: "Standard allowance"
linkTitle: "5 - Standard allowance"
weight: 50
---


The STDCM module must be usable with
[standard allowances]({{< ref "docs/explanation/running_time_calculation/allowances" >}}).
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

#### During the exploration

The main implication of the standard allowance is during
the graph exploration, when we identify conflicts.
It means that we need to scale down the speeds. We still need
to compute the maximum speed simulations (as they define
the extra time), but when identifying at which time we see
a given signal, all speeds and times are scaled.

This process *is not exact*. It doesn't properly account for
the way the allowance is applied (especially for MARECO).
But at this point we don't need exact times, we just need
to identify whether a solution would exist at this approximate time.


{{% alert color="info" %}}
This slightly inexact process may seem like a problem, but in
reality (for SNCF) standard allowances actually have some
tolerance between arbitrary points on the path. e.g. if
we should aim for 5 minutes per 100km, any value between
3 and 7 would be valid. The actual tolerance is not something
we can or want to encode as they're too many specificities,
but it means we can be off by a few seconds.
{{% /alert %}}

#### Post-processing


The process to find the actual train simulation is as follows:

1. We define points at which the time is fixed, initialized
   at first with the time of each train stop. This is an input
   of the simulation and indirectly calls the standard allowance.
2. If there are conflict, we try to remove the first one.
3. We add a fixed time point *at the location where that conflict
   happened*. We use the time considered during the exploration
   (with linear scaling) as reference time.
4. This process is repeated iteratively until no conflict is found.
