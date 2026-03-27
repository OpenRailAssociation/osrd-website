---
title: "Train slot search module"
linkTitle: "2 - Train slot search module"
weight: 30
---

This module handles the search for solutions.

To summarize how it works: the search space is defined as one large decision tree.

We first build one decision tree that lists all possible paths, where
each "decision" is the direction taken. We then build another tree on top
of it that handles simulations and conflicts, branching is done when the new
train gets to chose if it goes before or after a different train.

We then run an A* on the resulting graph.
