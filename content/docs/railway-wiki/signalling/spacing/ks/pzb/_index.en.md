---
title: "Punktförmige Zugbeeinflussung (PZB)"
linkTitle: "Punktförmige Zugbeeinflussung (PZB)"
weight: 30_000
---

<!-- script to auto-render KaTeX extension $$..$$ for outline formula, \\(...\\) for inline formula -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>


## Overview

The **Punktförmige Zugbeeinflussung (PZB)** is an intermittent train protection system used on most conventional railway lines in Germany.  
Its primary function is to ensure that trains respond correctly to restrictive signal aspects and speed limits.  
The PZB monitors the train’s compliance with braking requirements and automatically initiates braking interventions when these are violated.

The system acts as a safeguard against driver inattention or failure to observe signals and thereby prevents trains from passing stop signals or exceeding permitted speeds (*DB, 2014*).

The core tasks consist of monitoring braking maneuvers, protecting against trains continuing past stop signals, and preventing trains from moving forward against stop signals, for example after a scheduled stop at platforms (*DB, 2024*)

## System Components

The PZB consists of two main parts:

1. **Trackside equipment**, composed of inductive magnets installed along the track near signals.
2. **Onboard equipment**, located on the locomotive to communicate with the magnets and supervise train operation.

### Trackside Magnets

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Magnet_1000_2000.png" width="740px" >}}

*Source: Dominik Wefering*

Three types of track magnets are used, each operating at a distinct frequency (*DB, 2014*):

| Frequency | Location | Function |
| :--- | :--- | :--- |
| **1000 Hz** | At the **distant signal** | Activates supervision when the distant signal shows a restrictive aspect (*Ks 2*). The driver must acknowledge the magnet within 2,5 seconds and a braking sequence begins. |
| **500 Hz** | About **260 m before the main signal** | Reinforces braking supervision before a stop signal. The train must reduce its speed further. |
| **2000 Hz** | At the **main signal** | Immediately triggers an emergency brake if the train passes a stop signal (*Hp 0*). |

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Magnets.png" width="740px" >}}

On combinationsignals (see [Ks Signalling](../_index.en.md/)) there are double-track magnets with frequencies of 1000 and 2000 Hz combined.

The picture below shows an distant signal with the aspect *Ks 2* and the 1000 Hz magnet to the left of the signal.

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/distant_signal_with_magnet.png" width="740px" >}}

*Source: Dominik Wefering*

### Onboard Equipment

The onboard system receives inductive signals from the track magnets and monitors (*DB, 2014*):

- The **acknowledgement** of signal aspects by the driver.
- The **elapsed time** and **distance** since the last magnet activation.
- The **train speed** relative to permitted limits defined by the current supervision state.

If the driver fails to acknowledge or reduce speed as required, the system triggers an **automatic emergency brake** until a full stop.

## Train types
PZB makes a distinction between three train types (german: Zugart): O, M, U
- O = Upper train type (german: Obere Zugart)
- M = Middle train type (german: Mittlere Zugart)
- U = Lower train type (german: Untere Zugart)

The distinction is based on the brake percentages of the train (*Maschek, 2022*):

| Train type | Brake percentages | monitored maximum speed |
| :---: | :---: | :---: |
| O | > 110 | 165 |
| M | 66 - 110 | 125 |
| U | < 66 | 105 |

The braking percentage is a standardized measure in railway operations used to quantify a train’s braking capability.  
It is defined as the ratio of the **effective braking weight (B)** to the **train mass (m)**, multiplied by 100 (*Kache, 2024*):

$$ \lambda=\frac{B}{m}*100 $$

This value indicates how effectively a train can decelerate relative to its mass. A higher braking percentage corresponds to a shorter braking distance, allowing for a direct comparison between different trains.  

## Supervision Logic of PZB

The system evaluates train movement against predefined supervision limits. Each magnet initiates a specific monitoring function:

- **Time-based supervision**
- **Distance-based supervision**
- **Speed thresholds**

These parameters are dynamically managed depending on train type.

The supervised values depending on the train type are as follows:
| Train type | Upper (O) | Middle (M) | Lower (U) |
| :--- | :--- | :--- | :--- |
| Maximum Speed | 165 km/h | 125 km/h | 105 km/h |
| Braking curve of 1000 Hz influence | 85 km/h after 23 Sec. | 70 km/h after 29 Sec. | 55 km/h after 35 Sec. |
| Braking curve of 500 Hz influence | from 65 to 45 km/h within 153 m | from 50 to 35 km/h within 153 m | from 40 to 25 km/h within 153 m |

## Supervision Curves
The basic principle of the supervision curves in PZB is shown in the following illustration

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_Principle.png" width="740px" >}}

*based on Maschek (2022)*

The values in the table above result in the following six supervision curves for the PZB for each train type:

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Supervision_Curves.png" width="740px" >}}

## Release from 1000 Hz supervision
700 m after the 1000 Hz influence the train driver can release from the 1000 Hz influence if the main signal has turned to *Ks 1* again in the meantime. In this case he can accelerate again to the maximum permitted speed.

## Restrictive Mode
If a train stops while a PZB supervision is active, or if its speed drops below the **switching speed** of 10 km/h for at least 15 seconds, **more restrictive supervision curves** are activated. 

In this **restrictive mode**, the 1000 Hz supervision curve is lowered to a maximum permissible speed of **45 km/h**.  
Similarly, for the **500 Hz supervision**, the system enters a restrictive state if, within the 153 m monitoring section, the train travels for more than 15 seconds below the **switching speed** of 30 km/h, while the speed continues to decrease toward 10 km/h.  

What it is used for: When a train stops at the platform, for example, the overlap behind the destination signal is cleared and the switches are released. The restrictive curves ensure that a train that starts moving without permission after stopping will travel slowly enough not to pose a danger to other trains, as it gets an emergency brake at the main signal from the 2000 Hz magnet and comes to a full top within the overlap.

## Safety Function

The PZB ensures safety through **automatic emergency braking** when:

- The driver fails to acknowledge a restrictive signal,
- The train exceeds the monitored speed during supervision,
- Or a stop signal (*Hp0*) is passed.

This guarantees that even under human error or distraction, train operations remain within safe limits and the risk of signal overruns is minimized.

## Assumptions for a simplified OSRD-Model

- Modeling emergency braking is not necessary, as an ideal driving curve is simulated.
- Modeling the restrictive modes is not necessary, since an ideal driver behavior is simulated.
- There is no infrastructuremodel for magnets in OSRD. PZB logic is based on the position of the signals.
- The braking curve for a train is assumed to be constant over the whole braking distance.
- There are no overlaps implemented yet (no direct effect on braking curve, but affects blocking time since the train brakes a bit earlier than with overlaps).
- The distance between distant and main signal is assumed to be 1000 m.
- The sighting distance for a distant signal is 300 m.
- The train starts braking when he sees the distant signal with the aspect *Ks 2* (expect stop).
- The constant deceleration is used for braking to a full stop, for speed changes and for the spacing and routing requirements.
- A train can release from braking 700 m behind the distant signal if the main signal shows *Ks 1*
- The calculated braking curve ensures that the PZB restrictions (1000 and 500 Hz) are complied with.
- There is no value for brake percentages of a train in OSRD at the moment. The different braking curves are set depending on the rolling stock category and the trains maximum speed.
    - Upper Train type = Passenger Train with \\(v_{O,max} = 160 km/h\\),
    - Middle Train type = Freight or Passenger Train with \\(v_{M,max} = 120 km/h\\),
    - Lower Train type = Freight train with \\(v_{U,max} = 100 km/h\\),
- The required deceleration was calculated in the following steps:
    1. Calculating the 1000 Hz and 500 Hz curve that result from the restrictions of the PZB.
    2. Calculating the deceleration which is needed to brake from sight point of the distant signal to the main signal -> violates the 500 Hz condition.
    3. Calculating a decelertation that also fulfills the 500 Hz condition.

-  For the Upper Train type the result is a constant deceleration of 0,86 \\(m/s²\\) (solid green line):
	
	{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_O_Model.png" width="740px" >}}

- The same was done for the middle and lower train type resulting in the following decelerations:
    - M :  0,49 \\(m/s²\\)
    - U :  0,35 \\(m/s²\\)

## References

- DB AG. Ril 483.0111 Punktförmige Zugbeeinflussunganlagen bedienen. Aug. 2014
- DB AG. Ril 819.1310 Punktförmige Zugbeeinflussung (PZB); Grundsätze für das Ausrüsten von Strecken. Juli 2024.
- Martin Kache. Fahrdynamik der Schienenfahrzeuge: Grundlagen der Leistungsauslegung sowie der Energiebedarfs- und Fahrzeitberechnung. de. Wiesbaden: Springer Fachmedien Wiesbaden, 2024
- Ulrich Maschek. Sicherung des Schienenverkehrs: Grundlagen und Planung der Leit- und Sicherungstechnik. de. Wiesbaden: Springer Fachmedien Wiesbaden, 2022.

