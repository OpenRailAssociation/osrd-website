---
title: "ERTMS Braking Curves"
linkTitle: "ERTMS Braking Curves"
weight: 10 000
---

## Context

The onboard computer of ETCS-enabled trains has to compute a number of position / speed curves.
Here is how it works:

- below all the curves, the speed indicator is white
- above the indication curve, the speed indicator is yellow
- above the permitted curve, the speed indicator is orange
- above the warning curve, an alarm rings
- above the intervention curves, an emergency break intervention is triggered

## Inputs

In order to compute any of these curves, a number of things are needed:

- target data (the destination of the braking curve, which can be EOA and SvL or LOA and MRSP)
- train data
- infrastructure data
- infrastructure manager constants
- standardized constants

### Train

- max speed
- length
- rotating mass
- `T_traction_cutoff`: the time it take to cut off traction
- braking model, either lambda or gamma:
  - lambda (braking weight/mass)
  - gamma (contant deceleration at a given speed)
- correction factors (k\_dry and k\_wet for gamma braking) for braking curves

### Infrastructure

- corrected gradients (it incorporates curvature)
- odometry balises location

## Processes

### Braking coefficients:

- `A_brake_emergency` is the expected emergency braking capability, without safety margins
- `A_brake_safe` is the emergency braking coefficient, **with** safety margins
- `A_brake_service` is the expected service braking capability, without safety margins

### Speed / distance targets

- `EOA` end of movement authority: the location until which the train is allowed to move
- `SvL` supervized location: the protected location


### Curves

- `SBD` supervised braking deceleration: intermediary result computed from `EOA` and `A_brake_service`
- `EBD` emergency braking deceleration: intermediary result computed from `SvL` and `A_brake_safe`

All the curves below are cut below a given release speed:

- `EBI` (emergency break intervention) computed from `EBD`, shifted in position and space given rolling stock metadata
- `SBI1` computed from `SBD`, shifted in **time** with `Tbs1`
- `SBI2` computed from `SBD`, shifted in **time** with `Tbs2`
- `FLOI` (also called `SBI`, the intervention curve) the minimum of `SBI1` and `SBI2`
- `WARNING` (warning curve) computed as a shift of `FLOI` by `Twarning`
- `PS` (permitted speed curve): shift of `WARNING` by time `Tdriver`
- `INDICATION` is a shift of `PS` by time `Tindication`
