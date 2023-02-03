---
title: "Signaling"
linkTitle: "Signaling"
weight: 43
description: "Describes the signaling model"
---

{{% pageinfo color="warning" %}}
This document is pending review
{{% /pageinfo %}}

## Description

The signaling layer includes all signals, which respond to track occupancy and
reservation.  Signals can be of different types, and are modularly loaded. Only
their behavior towards the state of the infrastructure and the train's reaction
to signaling matters.

Signals are connected to each other by blocks. Blocks define the movements
authorized by signaling.

## Goals

The signaling system is at the crossroads of many needs:

- it must allow for realistic signaling simulation in a multi-train simulation
- it must allow the conflict detection system to determine which resources are required for the train
- it must allow application users to edit and display signals
- it must allow for visualization of signals on a map

## Design requirements:

Static data:

- must enable the front-end to display the signals
- must enable the infrastructure editor to configure signals
- must enable the back-end to simulate signals
- must be close to realistic industry models
- must allow for the modeling of composite signals, which carry several
  logical signals within a single physical signal

To simulate signaling:

- blocks must be generated for both user convenience and **pathfinding**
- for each signal, its **next compatible signal** and **protected zones** must be deduced
- the **minimum necessary information** must be provided to the signaling modules for their operation
- using signaling modules without having to instantiate a complete simulation must be enabled
- the design of the signaling module API must allow for signals to be loaded in any order

```yaml
{
    # unique identifier for the signaling system
    "id": "BAL",
    "version": "1.0",
    # a list of roles the system assumes
    "roles": ["MA", "SPEED_LIMITS"],
    # the schema of the dynamic state of signals of this type
    "signal_state": [
        {"kind": "enum", "field_name": "aspect", values: ["VL", "A", "S", "C"]},
        {"kind": "flag", "field_name": "ralen30"},
        {"kind": "flag", "field_name": "ralen60"},
        {"kind": "flag", "field_name": "ralen_rappel"}
    ],
    # the schema of the settings signals of this type can read
    "signal_settings": [
        {"kind": "flag", "field_name": "Nf", "display_name": "Non-franchissable"},
        {"kind": "flag", "field_name": "has_ralen30", "default": false, "display_name": "Ralen 30"},
        {"kind": "flag", "field_name": "has_rappel30", "default": false, "display_name": "Rappel 30"},
        {"kind": "flag", "field_name": "has_ralen60", "default": false, "display_name": "Ralen 60"},
        {"kind": "flag", "field_name": "has_rappel60", "default": false, "display_name": "Rappel 60"}
    ],

    # these are C-like boolean expressions:
    # true, false, <flag>, <enum> == value, &&, || and ! can be used

    # used to evaluate whether a signal is a block boundary.
    "block_boundary_when": "true",

    # used to evaluate whether a signal is a route boundary.
    "route_boundary_when": "Nf",

    # used for naive conflict detection.
    "constraining_ma_when": "aspect != VL"
}
```

## Assumptions

- Each physical signal can be decomposed into a list of logical signals, all of which are associated with a signaling system.
- Blocks have a type.
- It is possible to determine, given only the signal, its delimiting properties.
- Blocks never cross route boundaries.
- Blocks which are not covered by routes do not exist, or can be ignored.
- At any time, trains only use one signaling system capable of transmitting movement authority.

# Design of Signaling Systems

Each signaling system has:

- A unique identifier (a string).
- A set of roles:
    - Transmission of Movement Authority
    - Transmission of speed limits
- Its signal state type, which enables deducing:
    - The graphical representation of the signal
    - How a train would react to the signal
    - If the signal state constrains Movement Authority
- The signal parameter types, names and description, which enable front-end edition of signal parameters.
- The block and route conditions, which enable evaluating whether a signal delimits blocks or routes, given its parameters.

Note that if a signaling system has a dual role of transmitting Movement Authority (MA) and speed
limits, not all signals in this system are necessarily tasked with transmitting
speed limit information.

# Design of blocks

The blocks have several attributes:

- A signaling system that corresponds to that displayed by its first signal.
- A **path**, which is a list of direction + detector pairs (just like route paths).
- An **entry signal**, (optional when the block starts from a buffer stop).
- **Intermediate signals**, if any (only used by systems with distant signals).
- An **exit signal**, (optional when the block ends at a buffer stop).

The path is expressed from detector to detector so that it can be overlayed with the route graph.

A few remarks:

- There can be multiple blocks with the same path, as long as they have different signaling systems. Trains only use a block at a time, and ignore others.
- Blocks do not have a state: one can rely on the dynamic state of the zones that make it up.
- Blocks are used to figure out which signals protect which zones in a given context.

# Design of signals

Physical signal are made up of one or more logical signals, which are displayed as a single unit on the field. During simulation, logical signals are treated as separate signals.

Each logical signal is associated with a signaling system, which defines if the
signal transmits Movement Authority, speed limits, or both.

Logical signals have one or more drivers. Signal drivers are responsible for computing
signal state. Any given signal driver only works for a given pair of signaling systems,
where the first one is displayed by the signal, and the second is the one displayed by
the next signal.

When a logical signal has an empty driver list, its content is deduced from neighboring signals.

For example, a BAL signal that is both a departure of the TVM block and a
departure of the BAL block, it will have two drivers: `BAL-BAL` and `BAL-TVM`.

## Raw signal format

The raw signal format is the user-editable description of a physical signal.

Raw signals have a list of logical signals, which are independently simulated units sharing
a common physical display. Each logical signal has:

- a signaling system
- user-editable settings, as specified in the signaling system description
- a list of allowed next signaling systems, which are used to load drivers

For example, this signal encodes a BAL signal which starts both a BAL and a TVM block:
```yaml
{
    # signals must have location data.
    # this data is omitted as its format is irrelevant to how signals behave

    "logical_signals": [
        {
            # the signaling system shown by the signal
            "signaling_system": "BAL",
            # the settings for this signal, as defined in the signaling system manifest
            "settings": {"has_ralen30": "true", "Nf": "true"},
            # this signal can react to BAL or TVM signals
            # if the list is empty, the signal is assumed to be compatible with all following signaling systems
            "next_signaling_systems": ["BAL", "TVM"]
        }
    ]
}
```

For example, this signal encodes a BAL signal which starts a BAL block, and shares its physical display / support with a BAPR signal starting a BAPR block:
```yaml
{
    # signals must have location data.
    # this data is omitted as its format is irrelevant to how signals behave

    "logical_signals": [
        {
            "signaling_system": "BAL",
            "settings": {"has_ralen30": "true", "Nf": "true"},
            "next_signaling_systems": ["BAL"]
        },
        {
            "signaling_system": "BAPR",
            "settings": {"Nf": "true", "distant": "false"},
            "next_signaling_systems": ["BAPR"]
        }
    ]
}
```

Such signal descriptions can be condensed down into a simplified description string, for the specific use-case of representing / generating signal icons: `BAL[Nf=true,ralen30=true]+BAPR[Nf=true,distant=false]`

### Loading Signal Parameters

The first step of loading the signal is to characterize the signal in the signaling system.
This step produces an object that describes the signal.

During the loading of the signal:

   - the signaling system corresponding to the provided name is identified
   - the signal parameters are loaded and validated according to the signaling system spec
   - the signal's block and route delimiting properties are evaluated

### Loading the Signal

Once signal parameters are loaded, drivers can be loaded. For each driver:

   - The driver implementation is identified from the `(signaling_system, next_signaling_system)` pair.
   - It is verified that the signaling system outgoing from the driver corresponds to the one of the signal.
   - It is verified that there is no existing driver for the incoming signaling system of the driver.

This step produces a `Map<SignalingSystem, SignalDriver>`, where the signaling
system is the one incoming to the signal.  It then becomes possible to construct
the loaded signal.

### Constructing Blocks

   - The framework creates blocks between signals following the routes present in the infrastructure, and the block properties of the signals.
   - Checks are made on the created block graph: it must always be possible to choose a block for each signal and each state of the infrastructure.

### Speed Limits

Speed limits are represented as ranges on routes.
They start their life as ranges on track sections, and are lifted to ranges on routes as follows:

   - Directional speed limits by track are elevated to routes. The same speed limit can be on multiple routes.
   - For each speed limit, the route graph is traversed in reverse searching for signals capable of handling the limit:
       - Only speed limits not preceded by another limit with identical properties are considered.
       - Each signal must signal its interest in a speed limit: Not concerned, Concerned but to be announced by another signal, or Concerned and terminal.
   - For each speed limit planned along the train's path, the signals in the announcement chain are added to the list of those to be simulated for the train.

```rust
enum SpeedLimitHandling {
    /** This signal isn't supposed to announce this limit */
    Ignore,
    /** This signal should announce this limit, but cannot */
    Error,
    /** This signal can announce this limit, and is part of an ongoing chain */
    Chain,
    /** This signal can announce this limit, and ends the chain */
    EndChain,
}

fn handles_speed_limit(
   self: SignalSettings,
   speed_limit: SpeedLimit,
   distance_mm: u64,
) -> SpeedLimitHandling;

fn handles_speed_limit_chain(
   self: SignalSettings,
   speed_limit: SpeedLimit,
   chain_signal: Signal,
   distance_mm: u64,
) -> SpeedLimitHandling;
```

### Block validation

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

### Signal lifecycle

Before a train startup:

- the path a of the train can be expressed is given, both as routes and blocks
- the signal queue a train will encounter is established

During the simulation:
- along a train movement, the track occupation before it are synthesized
- when a train observes a signal, its state is evaluated

### Signal state evaluation

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

interface DirectSpeedLimit {
    /** Distance between the signal and the speed limit */
    val distance: Distance
    val speed: Speed
}

interface IndirectSpeedLimit {
    val distanceToNextSignal: Distance
    val nextSignalState: SignalState
    val nextSignalSettings: SignalSettings
}

interface SpeedLimitView {
    /** A list of speed limits directly downstream of the signal */
    val directSpeedLimits: List<DirectSpeedLimit>
    /** A list of speed limits which need to be announced in a signal chain */
    val indirectSpeedLimits: List<IndirectSpeedLimit>
}

fun signal(maView: MAView?, limitView: SpeedLimitView?): SignalState {
    // ...
}
```

The view should allow access to the following data:

 - a synthetized view of zones downstream until the end of the train's MA
 - the block chain
 - the state of downstream signals which belong to the current block chain

### Signaling view path

The path along which the MAView and SpeedLimitView live is best expressed using blocks:

- blocks can be added to extend the view along the path of a train
- the view can be reduced by removing blocks, as the train passes by signals

### Simulation outside the train path

Everything mentionned so far was designed to simulate signals between a train the
end of its movement authority, as all others signals have no influence over the behavior
of trains (they cannot be seen, or are disregarded by drivers).

Nevertheless, one may want to simulate and display the state of all signals at a given point in time,
regardless of which signals are in use.

Simulation rules are as follows:

  - if a signal starts blocks which have differing paths, it is simulated as if it were at the end of a route
  - if a signal starts blocks which all start the same path, it is simulated in the same view as the next signals in this path

## Dependencies

For the block graph generation:

   - route graph. For each route:
       - `waypoints: List<DiDetector>`
       - `signals: OrderedMap<Position, UnloadedSignal>`
       - `speed_limits: RangeMap<Position, SpeedLimit>`, including the logic for train category limits
   - signaling systems
   - drivers

For evaluation:

   - train path in blocks
   - portion of the path to evaluate
   - drivers
   - state of the zones in the section to evaluate

## Operations

   - **Instantiating a view** creates a framework for observing signals
   - **Planning the path signals** to the view the blocks that the train will traverse
   - **Observing a signal** subscribe to the state of a signal (through the view)
   - **Passing a signal** signals that a signal has been passed by the train (through the view)

## Appendices

### Research Questions

   - Are there any blocks that overlap the end of a route? SNCF(Loïc): No.
   - Are there any signals which rely on the state of the one after next signal? SNCF(Loïc): No.
   - Are there signals that change behavior based on the active block in front of them? SNCF(Loïc): Yes, for slowdowns.
   - Are there signals that are the start of blocks of different types? SNCF(Loïc): Yes.
   - Can the behavior of a signal depend on which block is active after the end of the current block? SNCF(Loïc): Yes, with slowdowns or blinking yellow.
   - Do some signaling systems need additional information in the blocks? SNCF(Loïc): Kind of, there are slowdowns, but it's not specifically carried by the block.
   - Is it nominal for a train to have multiple active signaling systems at the same time? SNCF(Loïc): No.
   - When and by whom are the blocks generated?
   - What data is necessary for generating the blocks?
