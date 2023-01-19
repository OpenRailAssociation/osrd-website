---
title: "Allowances"
linkTitle: "5 - Allowances"
weight: 50
---

<font color=#aa026d>

### The purpose of allowances

</font>

As explained in the [calcul du Max Effort Profile](../pipeline/#calculation-of-the-max-effort-profile), the **basic running time** represents the most stretched run normally achievable, i.e. the fastest possible run of the given equipment on the given route. The train accelerates to the maximum, travels as fast as possible according to the different speed limits and driving capabilities, and brakes to the maximum.

This basic run has a major disadvantage: if a train leaves 10 minutes late, it will arrive at best 10 minutes late, because by definition it is impossible for it to run faster than the basic run. Therefore, trains are scheduled with one or more allowances added. The allowances are a relaxation of the train's route, an addition of time to the scheduled timetable, which inevitably results in a lowering of running speeds.

> A train running in basic gear is unable to catch up!

<font color=#aa026d>

### Allowances types

</font>

There are two types of allowances:

- **The regularity allowance**: this is the additional time added to the basic running time to take account of the inaccuracy of speed measurement, to compensate for the consequences of external incidents that disrupt the theoretical run of trains, and to maintain the regularity of the traffic. The regularity allowance applies to the whole route, although its value may change at certain intervals.
- **The construction allowance**: this is the time added/removed on a specific interval, in addition to the regularity allowance, but this time for operational reasons (dodging another train, clearing a track more quickly, etc.)

A basic running time with an added allowance of regularity gives what is known as a **standard walk**.

<font color=#aa026d>

### Allowance distribution

</font>

Since the addition of allowance results in lower speeds along the route, there are a number of possible routes. Indeed, there are an infinite number of solutions that result in the same journey time.

As a simple example, in order to reduce the running time of a train by 10% of its journey time, it is possible to extend any stop by the time equivalent to this 10%, just as it is possible to run at 1/1.1 = 90.9% of the train's capacity over the entire route, or to run slower, but only at high speeds...

There are currently two algorithms for margin distribution in OSRD: linear and economic.

<font color=#aa026d>

### Linear distribution

</font>

Linear allowance distribution is simply lowering the speeds by the same factor over the area where the user applies the allowance. Here is an example of its application:

![Python plot linear](../python_plot_linear.png)

The advantage of this distribution is that the allowance is spread evenly over the entire journey. A train that is late on 30% of its journey will have 70% of its allowance for the remaining 70% of its journey.

<font color=#aa026d>

### Economic distribution

</font>

The economic distribution of the allowance, presented in detail in [this document](/pdf/MARECO.pdf) (**MARECO** is an algorithm designed by the SNCF research department), consists of distributing the allowance in the most energy-efficient way possible. It is based on two principles:

1. a maximum speed, avoiding the most energy-intensive speeds
2. run-on zones, located before braking and steep gradients, where the train runs with the engine off thanks to its inertia, allowing it to consume no energy during this period

![Python plot eco with slopes](../python_plot_eco_w_slopes.png)

> An example of economic walking. Above, the gradients/ramps encountered by the train. The areas of travel on the track are shown in blue.
