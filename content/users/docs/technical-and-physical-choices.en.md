---
title: "Technical & physical choices"
linkTitle: "Technical & physical choices"
weight: 30
---

### <font color=#aa026d>What envelopes are?</font>

OSRD can be used to perform two kinds of calculation:
- **Standalone train simulation** where the running time calculation is performed without interaction between the train and the signaling system.
- **Many trains simulation** where a real dynamic simulation is run.

In both cases, during the simulation the train is supposed to follow some speed instructions. These are modeled in OSRD with space/speed curves called envelopes. There are two kinds of envelopes:
- Envelopes coming **from infrastructure and rolling stock data**, such us the max speed of the line and the max speed of the train; these are inputs to our calculation and they are not physically accurate because they are not the results of a real integration of the physical movement equations.
- Envelopes resulting **from a real integration** of the physical movement equations.

These contain also information about time.

### <font color=#aa026d>How the envelope system is used into OSRD?</font>

#### Standalone train simulation
#### Fastest running time calculation

The first goal of a standalone train simulation is to perform the **fastest running time calculation**, where the train runs at the max permitted speed. To obtain this, a procedure composed by different stages is used. At each stage, some new envelopes are calculated and added to the previous ones. The final resulting envelope is what we call **Max Effort envelope**.

- A first envelope is calculated at the begin of the simulation putting together all the envelopes related to some static speed limits (max speed of the line, max speed of the rolling stock, temporary speed restrictions, train category speed restrictions, axle load speed restrictions). The resulting envelope is called **Most Restricted Speed Profile (MRSP)**.
- All the braking curves are computed by starting from their target point, i.e. the point in space where a certain speed limits is imposed (finite target speed) or stop point (target speed = 0 m/s). The braking curves are calculated by considering all the active forces (braking force constant or not, frictions, gradient gravity force) and for this reason are physically accurate. The resulting envelope is called **Max Speed Profile**.
- For each points corresponding to a speed increase in the MRSP or at the end of a stop braking curve, an accelerating curve is computed. The accelerating curves are calculated by considering all the active forces (traction force, frictions, gradient gravity force) and for this reason are physically accurate.
- For all the envelope parts that are not physically accurate, a new integration of movement equations is performed. This last calculation is necessary for reproducing the correct behavior of envelope parts where the speed should be maintained at a constant value, by including the effect of all the forces. The resulting envelope is called **Max Effort Profile**.

#### Running time calculation with allowances

After having performed the fastest running time calculation, some allowances can be introduced into it. In the OSRD running time calculation, we decide to distribute allowances in an economical way, by minimizing the energy consumption during the train run. A new **Eco envelope**, resulting from a dichotomy algorithm, is therefore computed to distribute a certain allowance value into the previously calculated Max Effort envelope.

#### Many trains simulation

In the case of many trains simulation, the signaling system must assure **the safety**. The effect of signalization on to a train running time calculation is reproduced by overlapping dynamic envelopes onto the static one. A new dynamic envelope is introduced for example when a signal closes. The train follows the static economical envelope overlapped with the dynamic envelopes, if there are some. In this simulation mode, a check in time is done with respect to a theoretical time coming from the time information of the static economical envelope. If the train is late with respect to the scheduled time, it will stop following the economical envelope and try to go faster. Its space/speed curve will be therefore limited by the max effort envelope.

### <font color=#aa026d>Which integration method should OSRD use?</font>

Our [Integration Method](https://github.com/DGEXSolutions/osrd/wiki/Which-integration-method-should-OSRD-use) is available on the project's Github repositorie.