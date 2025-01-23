---
title: "Simulation lifecycle"
linkTitle: "Simulation lifecycle"
weight: 90
description: "Tells the story of how signaling infrastructure is loaded and simulated on"
---

## Loading Signal Parameters

The first step of loading the signal is to characterize the signal in the signaling system.
This step produces an object that describes the signal.

During the loading of the signal:

   - the signaling system corresponding to the provided name is identified
   - the signal properties and parameters are loaded and validated according to the signaling system spec
   - the signal's block and route delimiting properties are evaluated

## Loading the Signal

Once signal parameters are loaded, drivers can be loaded. For each driver:

   - The driver implementation is identified from the `(signaling_system, next_signaling_system)` pair.
   - It is verified that the signaling system outgoing from the driver corresponds to the one of the signal.
   - It is verified that there is no existing driver for the incoming signaling system of the driver.

This step produces a `Map<SignalingSystem, SignalDriver>`, where the signaling
system is the one incoming to the signal.  It then becomes possible to construct
the loaded signal.

## Constructing Blocks

   - The framework creates blocks between signals following the routes present in the infrastructure, and the block properties of the signals.
   - Checks are made on the created block graph: it must always be possible to choose a block for each signal and each state of the infrastructure.

## Block validation

The validation process helps to report invalid configurations in terms of signaling and blockage. The validation cases we want to support are:

- The signaling system may want to validate, knowing if the block starts / ends on a buffer:
    - the length of the block
    - the spacing between the block signals, first signal excluded
- Each signal in the block may have specific information if it is a transition signal. Therefore, all signal drivers participate in the validation.

In practice, there are two separate mechanisms to address these two needs:

- The **signaling system module** is responsible for validating signaling **within** blocks.
- **Signal drivers** take care of validating transitions **between** blocks.

```rust
extern fn report_warning(/* TODO */);
extern fn report_error(/* TODO */);

struct Block {
   startsAtBufferStop: bool,
   stopsAtBufferStop: bool,
   signalTypes: Vec<SignalingSystemId>,
   signalSettings: Vec<SignalSettings>,
   signalPositions: Vec<Distance>,
   length: Distance,
}

/// Runs in the signaling system module
fn check_block(
   block: Block,
);


/// Runs in the signal driver module
fn check_signal(
   signal: SignalSettings,
   block: Block, // The partial block downstream of the signal - no signal can see backward
);
```

## Signal lifecycle

Before a train startup:

- the path a of the train can be expressed is given, both as routes and blocks
- the signal queue a train will encounter is established

During the simulation:
- along a train movement, the track occupation before it are synthesized
- when a train observes a signal, its state is evaluated

## Signal state evaluation

Signals are modeled as an evaluation function, taking a view of the world and returning the signal state

```kotlin

enum ZoneStatus {
   /** The zone is clear to be used by the train */
   CLEAR,
   /** The zone is occupied by another train, but otherwise clear to use */
   OCCUPIED,
   /** The zone is incompatible. There may be another train as well */
   INCOMPATIBLE,
}

interface MAView {
    /** Combined status of the zones protected by the current signal */
    val protectedZoneStatus: ZoneStatus
    val nextSignalState: SignalState
    val nextSignalSettings: SignalSettings
}

fun signal(maView: MAView?): SignalState {
    // ...
}
```

The view should allow access to the following data:

 - a synthesized view of zones downstream until the end of the train's MA
 - the block chain
 - the state of downstream signals which belong to the current block chain

## Signaling view path

The path along which the MAView and SpeedLimitView live is best expressed using blocks:

- blocks can be added to extend the view along the path of a train
- the view can be reduced by removing blocks, as the train passes by signals

## Simulation outside the train path

Everything mentioned so far was designed to simulate signals between a train the
end of its movement authority, as all others signals have no influence over the behavior
of trains (they cannot be seen, or are disregarded by drivers).

Nevertheless, one may want to simulate and display the state of all signals at a given point in time,
regardless of which signals are in use.

Simulation rules are as follows:

  - if a signal starts blocks which have differing paths, it is simulated as if it were at the end of a route
  - if a signal starts blocks which all start the same path, it is simulated in the same view as the next signals in this path
