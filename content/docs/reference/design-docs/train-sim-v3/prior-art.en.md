---
title: "Prior art"
weight: 20
---

The current implementation has a number of shortcomings making it pretty much impossible to evolve to
meet current system requirements. It also has a number of less severe flaws, such as the over-reliance
on floating point, especially for input and output.

The previous implementation cannot be changed to:

- react to signaling, as constraints stay the same as the simulation evolves
- handle rich train state vectors, due to the way margins are implemented
- be usable for both incremental simulation and batch

These limitations are the primary reasons for this redesign.

## Margins

- are defined as post-processing filter passes on simulation results. This has a number of undesirable side effects:

  - margin algorithms produce the final simulation results. They may produce physically unrealistic simulations results
  - because margins are applied after the simulation, the simulation can't adjust to impossible margin values. Thus the simulation fails instead of giving a "best effort" result.
  - margin algorithms have no choice but to piece together results of different simulations:

    - engineering margins are defined such that their effect has to be entirely contained within their bounds.
      even though it's a desirable property, it means that simulations become a multi-pass affair, with no obvious
      way of keeping train behavior consistent accross passes and boundaries.
    - this can only be done if the train state is entirely described by its location and speed,
      otherwise simulation results cannot be pieced together.
    - piecing together simulation results is very hard to execute reliably, as there are many corner cases to be considered.
      the algorithm is quite brittle.

- how much time should be lost and where isn't defined in a way that makes scheduled points implementation easy
- when a transition between two margin values occurs, slow downs occur before value changes, and speed ups
  after value changes. This is nice in theory, because it makes the graphs look nicer. The downside is that it
  makes margin values interdependent at each slow-down, as how much speed needs to be lost affects the time lost
  in the section.


## Input modeling

With the previous implementation, the simulation takes sequence of constraint position and speed curves as an input
(continuous in position, can be discontinuous in speed), and produces a continuous curve.

The output is fine, but the input is troublesome:

- braking curves have to be part of constraint curves
- these constraint curves don't have a direct match with actual constraints, such as speed limits, stops, or reaction to signal
- constraints cannot evolve over time, and cannot be interpreted differently depending on when the train reached these constraints
- constraints cannot overlap. the input is pre-processed to filter out obscured constraints
