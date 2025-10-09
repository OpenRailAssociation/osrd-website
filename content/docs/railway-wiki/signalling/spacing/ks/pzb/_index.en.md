---
title: "Punktförmige Zugbeeinflussung (PZB)"
linkTitle: "PZB"
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

The core tasks consist of monitoring braking maneuvers, protecting against trains continuing past stop signals, and preventing trains from moving forward against stop signals, for example after a scheduled stop at platform (*DB, 2024*).

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

On combination signals (see [Ks Signalling](../_index.en.md/)) there are double-track magnets with frequencies of 1000 and 2000 Hz combined.

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

These parameters are dynamically managed depending on the train type.

## Basic principle of PZB supervision

The basic principle of the supervision curves in PZB is shown in the following illustration (see following schema for the exact shape of decrease):

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_Principle.png" width="740px" >}}

*based on Maschek (2022)*

## Supervision Curves

The supervised values depending on the train type are as follows:

| Train type | Upper (O) | Middle (M) | Lower (U) |
| :--- | :--- | :--- | :--- |
| Maximum Speed | 165 km/h | 125 km/h | 105 km/h |
| Braking curve of 1000 Hz influence | 85 km/h after 23 Sec. | 70 km/h after 29 Sec. | 55 km/h after 35 Sec. |
| Braking curve of 500 Hz influence | from 65 to 45 km/h within 153 m | from 50 to 35 km/h within 153 m | from 40 to 25 km/h within 153 m |

The values in the table above result in the following six supervision curves for the PZB for each train type:

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Supervision_Curves.png" width="740px" >}}

## Release from 1000 Hz supervision

700 m after the 1000 Hz influence, the train driver can stop braking if the main signal has turned back to *Ks 1* in the meantime. In this case, he can accelerate again to the maximum permitted speed.

## Restrictive Mode

If a train stops while a PZB supervision is active, or if its speed drops below the **switching speed** of 10 km/h for at least 15 seconds, **more restrictive supervision curves** are activated. 

In this **restrictive mode**, the 1000 Hz supervision curve is lowered to a maximum permissible speed of **45 km/h**.  
Similarly, for the **500 Hz supervision**, the system enters a restrictive state if, within the 153 m monitoring section, the train travels for more than 15 seconds below the **switching speed** of 30 km/h, while the speed continues to decrease toward 10 km/h.  

Typical example: When a train stops at the platform, the overlap behind the destination signal is cleared and the switches are released. The restrictive curves ensure that if the train starts moving without permission after stopping, it will travel slowly enough so as not to pose a danger to other trains. Once it arrives at the 2000 Hz magnet, its speed will be low enough for the emergency brake to make it come to a full stop wihtin the overlap.

## Safety Function

The PZB ensures safety through **automatic emergency braking** when:

- The driver fails to acknowledge a restrictive signal,
- The train exceeds the monitored speed during supervision,
- Or a stop signal (*Hp0*) is passed.

This guarantees that even under human error or distraction, train operations remain within safe limits and the risk of signal overruns is minimized.

## OSRD-modeling

The supervision curves are only used for calculating the deceleration values. They are not modeled in OSRD.

Emergency braking is not modeled and restrictive mode is not modeled.

The PZB braking curve is modeled for each train type with two constant decelerations \\(a_{type,1}\\) and \\(a_{type,0,5}\\). 

The deceleration is used for braking to a full stop, for slowdowns and for spacing and routing requirements. 

- \\(a_{type,1}\\) corresponds to a deceleration that brakes the train from the maximum speed applicable to the train type \\(v_{type,max}\\) down to below the check speed of the 500 Hz condition \\(v_{type,check,0,5}\\) (1000 Hz phase).

- \\(a_{type,0,5}\\) corresponds to a deceleration that brakes the train from the speed below the check speed \\(v_{type,res,0,5}\\) to a full stop within the distance between the 500 Hz Magnet and the associated main signal (500 Hz phase).

There are no overlaps implemented yet (only affects blocking time).

As PZB trains can use LZB tracks, in addition to LZB signal data should provide PZB signal at the entry of the LZB block and not at the entry of LZB subsections (It is only used for LZB partial block mode).

### Simplifications and assumptions

There is no infrastructure model for magnets in OSRD. The modeling is therefore based on signal locations.

A constant distance of \\(s_{0,5}\\) = 260 m is assumed as fictitious trigger of the 500 Hz phase.

A distant signal spacing of \\(s_{distant}\\) = 1000 m is assumed.

A sighting distance for distant signal of \\(s_{sight}\\) = 300 m is assumed.

OSRD trains do not have brake percentage values, so an alternative to define the used braking curves was used:

- The braking curves are set depending on the rolling stock category and the train's maximum speed.
    
    - Upper Train type: Passenger Train with \\(v_{O,max}\\) = 165 km/h,
    - Middle Train type: Freight or Passenger Train with \\(v_{M,max}\\) = 125 km/h,
    - Lower Train type: Freight train with \\(v_{U,max}\\) = 105 km/h.

#### Calculating the deceleration values

At first we have to calculate the deceleration for the 1000 Hz Phase, which was done with:

 $$ a_{type,1}=\frac{v²_{type,max}-v²_{type,check,0,5}}{2*(s_{sight}+s_{distant}-s_{0,5})} $$ 

 | Value | Meaning |
 | :--- | :--- |
 | \\(a_{type,1}\\) | Deceleration of the 1000 Hz phase |
 | \\(v_{type,max}\\) | Maxmimum speed per train type  |
 | \\(v_{type,check,0,5}\\) | Check speed of 500 Hz Magnet per train type |
 | \\(s_{sight}\\) | Sighting distance for distant signals |
 | \\(s_{distant}\\) | Distant signal distance |
 | \\(s_{0,5}\\) | Distance of 500 Hz magnet from main signal |

The result was rounded up to two decimal places to have a fixed value and a small margin for the actual speed-check of the 500 Hz magnet. 

Then with this deceleration the resulting speed at the position of the 500 Hz magnet \\(v_{type,res,0,5}\\) was calulated.

The next step was calculating the deceleration value for the 500 Hz phase:

$$ a_{type,0,5}=\frac{v²_{type,res,0,5}}{2*s_{0,5}} $$

| Value | Meaning |
| :--- | :--- |
| \\(a_{type,0,5}\\) | Deceleration of the 500 Hz phase |
| \\(v_{type,res,0,5}\\)| Resulting speed after 1000 Hz phase  |

### Stop braking curve

The resulting braking curves for each train type are as follows:

***The 1000 Hz and 500 Hz curves are displayed for informational purpose only.***

-  Upper train type (O)
    - \\(a_{O,1}\\) = 0,86 m/s² for the 1000 Hz phase and
    - \\(a_{O,0,5}\\) = 0,6 m/s² for the 500 Hz phase.
	
{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_O_Model_combined.png" width="740px" >}}
    
- Middle train type (M)
    - \\(a_{M,1}\\) = 0,49 m/s² for the 1000 Hz phase and
    - \\(a_{M,0,5}\\) = 0,36 m/s² for the 500 Hz phase. 

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_M_Model_combined.png" width="740px" >}}

- Lower train type (U)
    - \\(a_{U,1}\\) = 0,36 m/s² for the 1000 Hz phase and
    - \\(a_{U,0,5}\\) = 0,2 m/s² for the 500 Hz phase. 

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_Braking_Curve_U_Model_combined.png" width="740px" >}}

### Slowdown braking curve

In lineside signalling like the [Ks Signalling](../_index.en.md/) the speed restrictions generally apply at the next main signal. Therefore the slowdown needs to be handled differently, otherwise a train could harm the PZB conditions if the braking curve is applied to the destination point with the speed restriction. 

For slowdowns there are two cases:

1. The target speed is equal or higher than the initial checked speed of the 500 Hz magnet: The train brakes directly to the destination with the constant deceleration of \\(a_{type,1}\\). This allows to save some capacity, since the train is able to brake later.

2. The target speed is below the initial checked speed of the 500 Hz magnet: The train follows the stop braking curve until it reaches the target speed and then the train continues in a steady-state running at the target speed (release speed).

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/pzb/PZB_release_speed.png" width="740px" >}}

## References

- DB AG. Ril 483.0111 Punktförmige Zugbeeinflussunganlagen bedienen. Aug. 2014
- DB AG. Ril 819.1310 Punktförmige Zugbeeinflussung (PZB); Grundsätze für das Ausrüsten von Strecken. Juli 2024.
- Martin Kache. Fahrdynamik der Schienenfahrzeuge: Grundlagen der Leistungsauslegung sowie der Energiebedarfs- und Fahrzeitberechnung. de. Wiesbaden: Springer Fachmedien Wiesbaden, 2024
- Ulrich Maschek. Sicherung des Schienenverkehrs: Grundlagen und Planung der Leit- und Sicherungstechnik. de. Wiesbaden: Springer Fachmedien Wiesbaden, 2022.

