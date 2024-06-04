---
title: "Driving instructions"
weight: 20
---


Driving instructions model what the train has to do, and under what conditions.
Driving instructions are generated using domain constraints such as:

- unsignaled line speed limits
- permanent signaled speed limits
- temporary speed limits
- dynamic signaling:
  - block / moving block
  - dynamically signaled speed restrictions
- neutral zones
- stops
- margins

Examples of driving instructions include:

- Limit speed at a given location
- Lower pantographs

## Interpreting driving instructions

During the simulation, driving instructions are partitionned into 4 sets:

- `PENDING` instructions may apply at some point in the future
- `RECEIVED` instructions aren't enforced yet, but will be unless overridden
- `ENFORCED` instructions influence train behavior
- `DISABLED` instructions don't ever have to be considered anymore. There are multiple ways instructions can be disabled:
  - `SKIPPED` instructions were not received
  - `RETIRED` instructions expired by themselves
  - `OVERRIDEN` instructions were removed by another instruction

```mermaid
flowchart TD

subgraph disabled
    skipped
    retired
    overriden
end

subgraph active
    received
    enforced
end

pending --> received
pending --> skipped
received --> enforced
received --> overriden
enforced --> retired
enforced --> overriden
```

These sets evolve as follows:

- when an integration steps overlaps a `PENDING` instruction's received condition, it is `RECEIVED` and becomes a candidate to execution
  - existing instructions may be `OVERRIDEN` due to an `override_on_received` operation
- if an instruction cannot ever be received at any future simulation state, it transitions to the `SKIPPED` state
- when simulation state exceeds an instruction's enforcement position, it becomes `ENFORCED`. Only enforced instructions influence train behavior.
  - existing instructions may be `OVERRIDEN` due to an `override_on_enforced` operation
- when simulation state exceeds an instruction's retirement position, it becomes `RETIRED`


#### Overrides

When an instruction transitions to the `RECEIVED` or `ENFORCED` state, it can disable active instructions
which match some metadata predicate. There are two metadata attributes which can be relied on for overrides:

- the `kind` allows overriding previous instructions for a given domain, such as spacing or block signaled speed limits
- the `rank` can be used as a "freshness" or "priority" field. If two instructions overriding each other are received
  (such as when a train sees two signals), the rank allows deciding which instruction should be prioritized.

This is required to implement a number of signaling features, as well as stops, where the stop instruction is overriden
by the restart instruction.


#### Data model



```rust
struct ReceivedCond {
    position_in: Option<PosRange>,
    time_in: Option<TimeRange>,
}

struct InstructionMetadata {
    // state transitions
    received_when: ReceivedCond,
    enforced_at: Position,
    retired_at: Option<Position>,

    // instruction metadata, used by override filters. if an instruction
    // has no metadata nor retiring condition, it cannot be overriden.
    kind: Option<InstructionKindId>,  // could be SPACING, SPEED_LIMIT
    rank: Option<usize>,

    // when the instruction transitions to a given state,
    // instructions matching any filter are overriden
    override_on_received: Vec<OverrideFilter>,
    override_on_enforced: Vec<OverrideFilter>,
}

enum Instruction {
    NeutralZone,
    SpeedTarget {
        at: Position,
        speed: Speed,
    }
}

struct OverrideFilter {
    kind: InstructionKindId,
    rank: Option<(RankRelation, usize)>,
}

enum RankRelation {
    LT, LE, EQ, GE, GT
}
```

## Design decisions

### Lowering constraints to an intermediate representation

Early on, we started making lists of what domain constraints can have an impact on train behavior.
Meanwhile, to simulate train behavior, we figured out that we need to know which constraints apply at any given time.

There's a fundamental tension between these two design constraints, which can be resolved in one of two ways:

- either treat each type of constraint as its own thing during the simulation
- abstract away constraints into a common representation, and then simulate that

#### {{< rejected >}} Distinct constraint types

When we first started drafting architecture diagrams, the train simulation API directly took
a bunch of constraint types as an input. It brought up a number of issues:

- the high diversity of constraint types makes it almost impossible to describe all interactions between all constraint types
- the domain of some of these interactions is very complex (block signaling)
- when simulating, it does not seem to matter why a constraint is there, only what to do about it

We couldn't find clear benefits to dragging distinctions between constraint types deep into the implementation.

#### {{< rejected >}} Internal constraint types abstraction

We then realized that abstracting over constraint types during simulation had immense benefits:

- it allows expressing requirements on what constraints need to be enforceable
- it greatly simplifies the process of validating constraint semantics: instead of having to validate interactions between
  every possible type of constraints, we only have to validate that the semantics of each constraint type can be transfered
  to the abstract constraint type

We decided to explore the possibility of keeping constraint types distinct in the external API, but lowering these constraints into an intermediary representation internally. We found a number of downsides:

- the public simulation API would still bear the complexity of dealing with many constraint types
- there would be a need to incrementally generate internal abstracted constraints to support the incremental API

#### {{< adopted >}} External constraint types abstraction

We tried to improve over the previous proposal by moving the burden of converting many constraints into a common abstraction out of the simulation API.

Instead of having many constraint types as an input, the simulation API takes a collection of a single abstract constraint type. The task of converting
domain constraints to abstract driving instructions is left to the API user.

We found that doing so:

- reduces the API surface of the train simulation module
- decouples behavior from constraint types: if a new constraint type needs to be added, the simulation
  API only needs expansion if the expected behavior expected for this constraint isn't part of the API.


### Interpreting driving instructions

As the train progresses through the simulation, it reacts according to driving instructions
which depend on more than the bare train physics state (position, time, and speed):

- the behavior of a train on each block depends on the state of the last passed block signal
- if a train encounters a yellow light, then a red light, stops before the red light, and the
  red light turns green, the train may have to keep applying the driving instruction from the
  yellow signal until the green light is passed

Thus, given:

- set of all possible driving instructions (alongside applicability metadata)
- the result of previous integration steps (which may be extended to hold metadata)

There is a need to know what driving instructions are applicable to the current integration step.

Overrides are a way of modeling instructions which disable previous ones. Here are some examples:

- if a driver watches a signal change state, its new aspect's instruction might take precedence over the previous one
- as block signaling slows a train down, new signals can override instructions from previous signals, as they encode information that is more up to date

We identified multiple filtering needs:

- overrides happen as a given kind of restriction is updated: SPACING instructions might override other SPACING instructions, but wish to leave other speed restrictions unaffected
- as multiple block signals can be visible at once, there's a need to avoid overriding instructions of downstream signals with updates to upstream signals

We quickly settled on adding a kind field, but had a lengthy discussion over how to discriminate upstream and downstream signals. We explored the following options:

- {{< rejected >}} adding `source` metadata, which was rejected as it does not address the issue of upstream / downstream
- {{< rejected >}} adding identifiers to instructions, and overriding specific instructions, which was rejected as it makes instruction generation and processing more complex
- {{< adopted >}} adding some kind of priority / rank field, which was adopted
