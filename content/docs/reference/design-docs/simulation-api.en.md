---
title: "Simulation API v2"
linkTitle: "Simulation API v2"
weight: 70
description: "Describes the internal programming interface for making simulations"
---

## Requirements

- `signaling`: depending on the signal state, which can change over time, add braking curves / coasting
- `margins`: support mareco by additional coasting instructions and speed limit constraints can be added / removed
- `stdcm` `standalone`: forward simulation on the entire path
- `stdcm`: when the MRSP changes in a way that does not correspond to the already simulated path, backtrack
- `stdcm`: incrementaly add construction margins and observe the result (this requirement might be lifted, if we instead provide an API to decide whether a margin can be added)
- `stdcm` `standalone` `signaling`: the train's state has to be evolve in time in other ways than just position: battery state, pantograph level, reaction time, or any other parameter might be introduced
- `signaling`: the state of the environment can evolve over time: signals can change state as the train gets ready to leave the station, or as another train leaves out of the way
- `scheduled_points`: stop durations and departure times must be supported

## Lessons learnt

- compute braking curves / coasting curves backwards, and sync up integration stops on the forward pass by extract the required deleration / distance / speed
- allow having multiple integration steps at the same position. This is required for stops time to be included in the total runtime.
- store all integration results with fixed point numbers, do the math internal to each step with floating point. Never do floating point with absolute path offsets.
- have separate data structures for storing the input braking curves and the ouput integration result

## Design questions

### Product

What business value do linear construction margins bring? The non-physical post-processing of simulation result adds more constraints to an already very constrained design process. Just lowering the speed ceiling would be easier and more realistic.
