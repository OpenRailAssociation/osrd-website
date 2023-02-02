---
title: "Train slot search module"
linkTitle: "2 - Train slot search module"
weight: 30
---

This module handles the search for solutions.

To reduce the problem to its simplest form and for easy and efficient
testing, inputs and outputs are strongly simplified and abstracted.

To summarize its behavior:
the solution space is described as a graph that encodes locations,
time, and speed. A pathfinding is run on this graph to find a solution.

This graph could, in a way, be seen as a decision tree,
but different paths can lead to the same node.
