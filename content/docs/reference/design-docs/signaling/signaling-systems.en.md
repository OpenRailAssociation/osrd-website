---
title: "Signaling systems"
linkTitle: "Signaling systems"
weight: 10
---

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
    # describes static properties of the signal
    "signal_settings": [
        {"kind": "flag", "field_name": "Nf", "display_name": "Non-franchissable"},
        {"kind": "flag", "field_name": "has_ralen30", "default": false, "display_name": "Ralen 30"},
        {"kind": "flag", "field_name": "has_rappel30", "default": false, "display_name": "Rappel 30"},
        {"kind": "flag", "field_name": "has_ralen60", "default": false, "display_name": "Ralen 60"},
        {"kind": "flag", "field_name": "has_rappel60", "default": false, "display_name": "Rappel 60"}
    ],

    # these are C-like boolean expressions:
    # true, false, <flag>, <enum> == value, &&, || and ! can be used

    # used to evaluate whether a signal is a block boundary. Only properties can be used, not parameters.
    "block_boundary_when": "true",

    # used to evaluate whether a signal is a route boundary. Only properties can be used, not parameters.
    "route_boundary_when": "Nf",

    # A predicate used evaluate whether a signal state can make a train slow down. Used for naive conflict detection.
    "constraining_ma_when": "aspect != VL"
}
```
