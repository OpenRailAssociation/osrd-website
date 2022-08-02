---
title: "Envelopes system"
linkTitle: "3 - Envelopes system"
weight: 30
---

The envelope system is an interface created specifically for the OSRD gait calculation. It allows you to manipulate different space/velocity curves, to slice them, to end them, to interpolate specific points, and to address many other needs necessary for the gait calculation.

<font color=#aa026d>

### A specific interface in the OSRD Core service

</font>

The envelope system is part of the core service of OSRD (see [software architecture](../architecture/_index.md)).

Its main components are :

**1 - EnvelopePart:** space/speed curve, defined as a sequence of points and having metadata indicating for example if it is an acceleration curve, a braking curve, a speed hold curve, etc.

**2 - Envelope:** a list of end-to-end EnvelopeParts on which it is possible to perform certain operations:

- check for continuity in space (mandatory) and speed (optional)
- look for the minimum and/or maximum speed of the envelope
- cut a part of the envelope between two points in space
- perform a velocity interpolation at a certain position
- calculate the elapsed time between two positions in the envelope

![envelope_scheme](../envelopes_scheme.png)

**3 - Overlays :** system for adding more constrained (i.e. lower speed) EnvelopeParts to an existing envelope.

<font color=#aa026d>

### Given envelopes vs. calculated envelopes

</font>

During the simulation, the train is supposed to follow certain speed instructions. These are modelled in OSRD by envelopes in the form of space/speed curves. Two types can be distinguished:

- Envelopes from **infrastructure and rolling stock data**, such as maximum line speed and maximum train speed. Being input data for our calculation, they do not correspond to curves with a physical meaning, as they are not derived from the results of a real integration of the physical equations of motion.
- The envelopes result from **real integration** of the physical equations of motion. They correspond to a curve that is physically tenable by the train and also contain time information.

A simple example to illustrate this difference: if we simulate a TER journey on a mountain line, one of the input data will be a maximum speed envelope of 160km/h, corresponding to the maximum speed of our TER. However, this envelope does not correspond to a physical reality, as it is possible that on certain sections the gradient is too steep for the train to be able to maintain this maximum speed of 160km/h. The calculated envelope will therefore show in this example a speed drop in the steepest areas, where the envelope given was perfectly flat.
