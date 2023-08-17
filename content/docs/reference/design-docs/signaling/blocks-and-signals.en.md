---
title: "Blocks and signals"
linkTitle: "Blocks and signals"
weight: 20
---


# Blocks

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

## Dependencies

   - route graph. For each route:
       - `waypoints: List<DiDetector>`
       - `signals: OrderedMap<Position, UnloadedSignal>`
       - `speed_limits: RangeMap<Position, SpeedLimit>`, including the logic for train category limits
   - signaling systems
   - drivers


# Signals

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

## Serialized format

The serialized / raw format is the user-editable description of a physical signal.

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
    ],
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

## Dependencies

For signal state evaluation:

   - train path in blocks
   - portion of the path to evaluate
   - drivers
   - state of the zones in the section to evaluate
