---
title: "Technical & physical choices"
linkTitle: "Technical & physical choices"
weight: 30
---

## <font color=#aa026d>What envelopes are?</font>

OSRD can be used to perform two kinds of calculation:
- **Standalone train simulation** where the running time calculation is performed without interaction between the train and the signaling system.
- **Many trains simulation** where a real dynamic simulation is run.

In both cases, during the simulation the train is supposed to follow some speed instructions. These are modeled in OSRD with space/speed curves called envelopes. There are two kinds of envelopes:
- Envelopes coming **from infrastructure and rolling stock data**, such us the max speed of the line and the max speed of the train; these are inputs to our calculation and they are not physically accurate because they are not the results of a real integration of the physical movement equations.
- Envelopes resulting **from a real integration** of the physical movement equations.

These contain also information about time.
