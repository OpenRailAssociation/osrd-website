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
reservation. Signals can be of different types, and are modularly loaded. Only
their behavior towards the state of the infrastructure and the train's reaction
to signaling matters.

Signals are connected to each other by blocks. Blocks define paths permitted
by signaling.

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
- enable using signaling modules without instantiating a complete simulation
- allow for signals to be loaded in any order, in parallel

## Assumptions

- Each physical signal can be decomposed into a list of logical signals, all of which are associated with a signaling system.
- Blocks have a type.
- It is possible to compute, given a signal alone, its block and route delimiting properties.
- Blocks never cross route boundaries.
- Blocks which are not covered by routes do not exist, or can be ignored.
- At any time, trains only use one signaling system capable of transmitting movement authority.

## Operations

- **Instantiating a view** creates a framework for observing signals
- **Planning the path signals** to the view the blocks that the train will traverse
- **Observing a signal** subscribe to the state of a signal (through the view)
- **Passing a signal** signals that a signal has been passed by the train (through the view)

## Research Questions

- Are there any blocks that overlap the end of a route? SNCF(Loïc): No.
- Are there any signals which rely on the state of the one after next signal? SNCF(Loïc): No.
- Are there signals that change behavior based on the active block in front of them? SNCF(Loïc): Yes, for slowdowns.
- Are there signals that are the start of blocks of different types? SNCF(Loïc): Yes.
- Can the behavior of a signal depend on which block is active after the end of the current block? SNCF(Loïc): Yes, with slowdowns or blinking yellow.
- Do some signaling systems need additional information in the blocks? SNCF(Loïc): Kind of, there are slowdowns, but it's not specifically carried by the block.
- Is it nominal for a train to have multiple active signaling systems at the same time? SNCF(Loïc): No.
- When and by whom are blocks generated?
- What data is required to generate blocks?
