---
title: "Linienförmige Zugbeeinflussung (LZB)"
linkTitle: "Linienförmige Zugbeeinflussung (LZB)"
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

The **Linienförmige Zugbeeinflussung (LZB)** is a continuous automatic train control system used to ensure safe and efficient operation at high speeds. Unlike the **Punktförmige Zugbeeinflussung (PZB)**, which transmits discrete signal information at fixed track points, the LZB enables **continuous bi-directional data exchange** between the train and the trackside control center. This allows for real-time supervision of speed and position and forms the basis for cabin signalling at speeds exceeding 160 km/h.

## System Structure

The LZB consists of three main components (*DB, 2019*):

1. **Trackside Equipment**  
   The track contains **cable loops** laid between the rails, divided into multiple segments.  
   These loops enable continuous communication between the train and the **LZB control center**.

	{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Cable.png" width="560px" >}}
   
   *Source: Pachl (2022)*

2. **Train Equipment**  
   Each LZB-equipped vehicle has an onboard unit that:
   - continuously determines the train’s position,
   - receives and interprets control information from the LZB center,
   - calculates braking curves and speed supervision data,
   - and automatically applies braking if limits are exceeded.

3. **LZB Control Center**  
   The control center transmits **Movement Authorities (MAs)** to the trains within the controlled area, defining:
   - the permissible target distance,
   - the permitted speed at each section,
   - and other route-specific restrictions like gradients

## Functionality

During operation, the train continuously reports its position to the LZB center. In return, it receives updated **target data** like actual speed (\\(v_{act}\\)), setpoint speed (\\(v_{set}\\)), target speed (\\(v_{target}\\)) and target distance.

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Parameters.png" width="740px" >}}

*based on: Pachl (2022)*

The onboard unit calculates **braking curves** for different supervision thresholds:

- **Permitted Speed Curve** – permissible maximum speed at each position.
- **Emergency Brake Curve** – triggers an emergency brake if the train fails to decelerate sufficiently.

The braking curve that is set by the onboard unit is based on:

- maximum track speed
- slope
- braking percentage of the train

The next target point is displayed up to 10.000 m in front of the train. If there is no restriction the speed limit equals the maximum track speed or the maximum possible speed of the train itself. (*Murr, 1991*)

## Braking Curves

For LZB there exist twelve braking curves with values between 0,115 und 1,10 \\(m/s^2\\). The value of the emergency braking curve is about 40% higher than the permitted speed curve. 

**The deceleration of the individual braking curves remains constant across the entire speed range.**

| Braking Curve Nr (BRN) | A | B | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Emergency Braking Curve [\\(m/s^2\\)] | 0,115 | 0,2 | 0,29 | 0,375 | 0,460 | 0,545 | 0,63 | 0,715 | 0,8 | 0,9 | 1,0 | 1,1 |
| Permitted Speed Curve [\\(m/s^2\\)] | 0,08 | 0,14 | 0,21 | 0,27 | 0,33 | 0,39 | 0,45 | 0,51 | 0,57 | 0,64 | 0,71 | 0,79 |

*based on: Braun (1988)*

The illustration below shows the braking curves for BRN 6 as an example.

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Braking_Curve.png" width="740px" >}}

The train driver enters the permissible speed and the brake percentage into the vehicle device. The gradient is specified for the route. The LZB uses this data to set the necessary braking curve. (*Braun, 1988*)

For Passenger trains the following curves must be set:

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Braking_Curve_Set_P.png" width="740px" >}}

*based on: Braun (1988)*

For freight trains the following curves must be set:

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Braking_Curve_Set_G.png" width="620px" >}}

*based on: Braun (1991)*

Where an "x" is written the combination of braking percentage and speed must not be possible.


## Full Block and Partial Block Mode

The **LZB** can operate in two different control modes: **Full Block Mode** (*german: Ganzblockmodus*) and **Partial Block Mode** (*german: Teilblockmodus*). Both modes determine how the track is divided into supervised sections and how the control center grants Movement Authorities (MAs) to trains.

In **Full Block Mode**, each train occupies an entire block section, similar to traditional fixed-block signalling systems. A new train is only allowed to enter a block once the preceding train has completely cleared it. This mode ensures maximum safety but limits the line capacity. (*Pachl, 2022*)

In **Partial Block Mode**, the LZB subdivides a block into several smaller **LZB subsections**. Each subsection can be individually monitored and released as the train progresses, allowing the following train to enter the same block earlier. This dynamic release mechanism increases line capacity significantly while maintaining safe separation between trains. (*Pachl, 2022*) The partial block principle thus enables higher traffic density and shorter headways, which are especially important for high-speed or high-frequency railway operations. The typical length of a LZB subsection is about 1200 m (*Busse, 2021*)

The picture below shows the Partial Block Mode. Train 1 occupies the block between the two main signals. Train 2 is a LZB train and is therefore allowed to enter the block until the section marker. Train 3 is not equipped with LZB and is therefore not allowed to enter the occupied block.

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Partial_Block.png" width="740px" >}}

## Assumptions for a simplified OSRD-Model

- Permitted speed curve is based on the emergency braking curve
- The braking curve is constant over the whole braking distance
- LZB-trains have a sight distance of 10.000 m
- The slope for choosing the braking curve is calculated wihtin these 10.000 m
- There are no overlaps implemented (only affects block time)
- The train follows the permitted speed curve and does not brake earlier
- The constant deceleration is used for braking to a full stop, for speed changes and for the spacing and routing requirements
- Switches are released when the following detector is crossed
- There is no value for brake percentages of a train in OSRD, so an alternative to define the used braking curves was used
   - The braking curves are set depending on the rolling stock category, the trains maximum speed and the slope.
- The following procedure was used to determine the necessary braking curves:
   - The average deceleration of each speed category was calculated and the corresponding braking curves was chosen. The resulting curves are also the ones that are used the most.

   {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/lzb/LZB_Braking_Curve_Set_P_Model.png" width="740px" >}}

   - The resulting curves for ≤ 200 and ≤ 250 km/h were the same so they were put together in one category
   - This results in the following braking curves that must be set for passenger trains:

      | Slope [‰] | ≤ 160 km/h | 160 - 250 km/h | 250 - 300 km/h |
      | :---: | :---: | :---: | :---: |
      | ≤ 5 | 7 | 6 | 5 |
      | ≤ 12,5 | 6 | 5 | 4 |

   - The corresponding deceleration (permitted speed curve) values that must be set for passenger trains depending on the maximum train speed and slope are as follows:

      | Slope [‰] | ≤ 160 km/h | 160 - 250 km/h | 250 - 300 km/h |
      | :---: | :---: | :---: | :---: |
      | ≤ 5 | 0,57 | 0,51 | 0,45 |
      | ≤ 12,5 | 0,51 | 0,45 | 0,39 |
      
		*note for OSRD: deceleration in other tools is 0,5 for all passenger trains (note can be removed later)*
   
   - For freight trains only two decelerations (permitted speed curve) were chosen. They cover all the relevant cases for freight trains with LZB.

      | Slope [‰] | ≤ 120 km/h |
      | :---: | :---: |
      | ≤ 5 | 0,33  |
      | ≤ 12,5 | 0,27 |

		*note for OSRD: deceleration in other tools is 0,3 for all freight trains (note can be removed later)*

## References

- Alfred Braun. „Aufstellen von Bremstafeln für Strecken mit Linienzugbeeinflussung“. In: ZEV Glasers Annalen 4 (1988), S. 108–118.
- Alfred Braun. "Die LZB-Bremstafeln für Güterzüge". In: Eisenbahningenieurkalender (1991), S. 275-282
- DB AG. Ril 819.1320 LZB; Grundsätze für die Ausrüstung mit linienförmiger Zugbeeinflussung. Dez. 2019.
- Eduard Murr. „Systembeschreibung der Linienzugbeeinflussung (LZB) der Deutschen Bundesbahn“. In: Eisenbahningenieurkalender (1991), S. 285–317.
- Jörn Pachl. Systemtechnik des Schienenverkehrs: Bahnbetrieb planen, steuern und sichern. de. Wiesbaden: Springer Fachmedien Wiesbaden, 2022.
- Matthias Busse. „Der optimierte Einsatz von ETCS-Bremskurven“. Dissertation. Dresden: Technische Universität Dresden, Feb. 2021.