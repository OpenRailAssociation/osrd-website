---
title: "Pipeline"
linkTitle: "4 - Pipeline"
weight: 40
---

The walk calculation in OSRD is a 4-step process, each using [the envelopes system](../envelopes_system):

1. [Construction of the most restrictive speed profile](#calculation-of-the-most-restricted-speed-profile-mrsp)
2. [Addition of the different braking curves](#calculation-of-the-max-speed-profile)
3. [Adding the different acceleration curves and checking the constant speed curves](#calculation-of-the-max-effort-profile)
4. [Application of allowance(s)](#application-of-allowances)

<p>&nbsp;</p>

<font color=#aa026d>

### Calculation of the Most Restricted Speed Profile (MRSP)

</font>

A first envelope is calculated at the beginning of the simulation by grouping all static velocity limits:

- maximum line speed
- maximum speed of rolling stock
- temporary speed limits (e.g. in case of works on a line)
- speed limits by train category
- speed limits according to train load
- speed limits corresponding to signposts

The length of the train is also taken into account to ensure that the train does not accelerate until its tail leaves the slowest speed zone. An offset is then applied to the red dashed curve. The resulting envelope (black curve) is called the **Most Restricted Speed Profile (MRSP)**. It is on this envelope that the following steps will be calculated.

![Most Restricted Speed Profile](../mrsp.png)

> The red dotted line represents the maximum permitted speed depending on the position.
> The black line represents the MRSP where the train length has been taken into account.

It should be noted that the different envelopeParts composing the MRSP are input data, so they do not correspond to curves with a physical reality.

<font color=#aa026d>

### Calculation of the Max Speed Profile

</font>

Starting from the MRSP, all braking curves are calculated using the overlay system (see [here](../envelopes_system/#a-specific-interface-in-the-osrd-core-service) for more details on overlays), i.e. by creating envelopeParts which will be more restrictive than the MRSP. The resulting curve is called **Max Speed Profile**. This is the maximum speed envelope of the train, taking into account its braking capabilities.

Since braking curves have an imposed end point and the braking equation has no analytical solution, it is impossible to predict their starting point. The braking curves are therefore calculated backwards from their target point, i.e. the point in space where a certain speed limit is imposed (finite target speed) or the stopping point (zero target speed).

![Max Speed Profile](../msp.png)

For historical reasons in hourly production, braking curves are calculated at SNCF with a fixed deceleration, the so-called hourly deceleration (typically ~0.5m/s²) without taking into account the other forces. This method has therefore also been implemented in OSRD, allowing the calculation of braking in two different ways: with this hourly rate or with a braking force that is simply added to the other forces.

<font color=#aa026d>

### Calculation of the Max Effort Profile

</font>

For each point corresponding to an increase in speed in the MRSP or at the end of a stop braking curve, an acceleration curve is calculated. The acceleration curves are calculated taking into account all active forces (traction force, driving resistance, weight) and therefore have a physical meaning.

For envelopeParts whose physical meaning has not yet been verified (which at this stage are the constant speed running phases, always coming from the MRSP), a new integration of the equations of motion is performed. This last calculation is necessary to take into account possible speed stalls in case the train is physically unable to hold its speed, typically in the presence of steep ramps (see [this example](../envelopes_system/#given-envelopes-vs.-calculated-envelopes)).

The envelope that results from the addition of the acceleration curves and the verification of the speed plates is called the **Max Effort Profile**.

![Max Effort Profile](../mep.png)

At this stage, the resulting envelope is continuous and has a physical meaning from start to finish. The train accelerates to the maximum, runs as fast as possible according to the different speed limits and driving capabilities, and brakes to the maximum. The resulting travel calculation is called the **basic running time**. It corresponds to the fastest possible route for the given rolling stock on the given route.

<font color=#aa026d>

### Application of allowance(s)

</font>

After the calculation of the basic run (corresponding to the Max Effort Profile in OSRD), it is possible to apply allowances. Allowances are additions of extra time to the train's journey. They are used to allow the train to catch up if necessary or for other operational purposes (more details on allowances [here](../allowances)).

A new **Allowances** envelope is therefore calculated using overlays to distribute the allowance requested by the user over the maximum effort envelope calculated previously.

![Allowances](../allowances.png)

In the OSRD running calculation it is possible to distribute the allowances in a linear way, by lowering all speeds by a certain factor, or in an economic way, i.e. by minimising the energy consumption during the train run.
