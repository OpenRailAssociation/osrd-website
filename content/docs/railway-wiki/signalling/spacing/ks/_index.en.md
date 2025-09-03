---
title: "Ks Signalling"
linkTitle: "Ks Signalling"
weight: 30_000
---

The Ks-system (Ks = Kombinationssignal; engl: combination signal) is a german signalling system introduced in 1994 by Deutsche Bahn (DB) in order to create a common system for East Germany (Hl-System) and West Germany (H/V-System) after the german reunification.


*The following paragraphs are mainly based on Pachl(2024), Railway Signalling Principles, Edition 3.0, p.20-30.*

## Block Section Principles
Railway lines are segmented into sequential block sections, each designed to be occupied by only one train at a time to ensure operational safety.
To maintain a safe distance between two trains, the separation must account for the following components:

- the braking distance of the following train,
- the full length of the block section,
- an additional block-extension safety margin, referred to as the overlap

Block sections are delineated by main signals, which regulate train entry based on specific safety conditions. A signal may only be cleared for a train to enter a block section if all of the following criteria are met:

- the preceding train has vacated the block section in question
- the overlap beyond the next signal has also been cleared by the preceding train
- the preceding train is secured by a stop signal
- the switches for the route to be set must be locked in the correct position
- on lines with bidirectional traffic, the train must additionaly be protected against any potential opposing movements

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/fixed_block_distance_signal_control_length.png" width="740px" >}}
*based on: Pachl (2024), Railway Signalling Principles*

## Signal control length and overlap principles
The control length of a signal refers to the section of track beyond the signal that must be verified as clear and safe before the signal can be set to proceed.

The **overlap** - a predefined safety margin - extends beyond the actual block section. Its primary function is to provide additional protection in the event that a train fails to stop at a signal displaying "stop". The overlap begins at the destination signal and ends at a prominent point. Depending on the speed at which the train approaches the stop signal, different lengths of overlaps must be provided. The length of the overlap is monitored by track vacancy detection systems like axle counters.

| speed [km/h] | overlap [m] | 
|-----------|-----------|
| 60 < v <= 160 | 200 |
| 40 < v <= 60 | 100 |
| v <= 40 | 50 |

A signal must remain at "stop" until the entire control length ahead is confirmed to be unobstructed. The clearing point for a signal corresponds to the end of the control length associated with the signal located behind it.

### Selective Overlaps
When selective overlaps are available (only at station's exit signals and station's intermediate signals) different overlap options can be chosen during route setting. These alternatives may vary in length or lead into different track sections. 

- An exit signal is the last signal within a station that serves to secure the exit to the free route. 
- An intermediate signal is set up in extensive station areas between the entry signal and the exit signal and delimits a station section within the station.


Once the signal has been cleared, the selected overlap cannot be changed without first cancelling the route.

If a shorter-than-standard overlap is selected, the signalling system will reduce the train's speed accordingly.

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/selective_overlaps.png" width="740px" >}}

*based on: DB AG, Ril 819.0202 Signale für Zug- und Rangierfahrten*


## Signal Indications in Ks-System
The Ks-signalling system utilizes a set of standardized signal aspects to convey operational instructions to train drivers. The primary signal indications include:

- **Stop (Hp 0)**: The train must come to a complete stop at the signal.
- **Expect stop (Ks 2)**: The train must be prepared to stop at the next main signal.
- **Clear (Ks 1)**: The train is permitted to proceed.

Within the Ks-system two signalling modes are implemented:

### One-Block Signalling
- The aspect displayed by a main signal is determined by the status of the immediately following block section.
- Each main signal is paired with a distant signal that provides the necessary approach indication.
- The distant signal is positioned at a distance corresponding to the braking distance from the associated main signal.

### Multi-Block Signalling (Two-Block Signalling is used by DB)
- The indication of a main signal is based on the status of **two** consecutive block sections ahead
- This approach allows for more dynamic and anticipatory signalling, enhancing operational efficiency and safety

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/one_block_two_block_signalling.png" width="740px" >}}
*based on: Pachl (2024), Railway Signalling Principles*

## Blocking time model
To ensure undisrupted train movement, a signal must be cleared before the approaching train reaches a point where it would otherwise need to initiate braking due to the aspect of the preceding signal.

The minimum headway between two successive trains is determined by the **blocking time**, which defines the time interval during which a block section is exclusively reserved for a single train and thus unavailable to others.

This model is applicable not only to conventional signalling systems but also to cabin (cab) signalling systems such as **LZB** and **ETCS**.

The blocking time is composed of several distinct components:

- **Signal Control Time**: The time required to process and clear the signal.  
- **Signal Watching Time**: The reaction time within which the approach signal must be cleared to prevent the driver from initiating braking.  
- **Approach Time**: The time taken by the train to travel from the approach signal to the entrance of the block section.  
- **Time Between Block Signals**: The duration required to traverse the distance between consecutive block signals.  
- **Clearing Time**: The time needed for the train to fully vacate the block section, including the overlap.  
- **Release Time**: The time required to unlock and release the block section for use by subsequent trains.  

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/blocking_time_model.png" width="740px" >}}
*based on: Pachl (2024), Railway Signalling Principles*

## Appearance of Ks-Signals with speed indicators

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_plus_speed_indicators.png" width="740px" >}}

{{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_multiblocksignal.jpeg" width="560px" >}}

*Ks-signal in Braunschweig main station, Source: Dominik Wefering*


## Signal Indications on a Ks-Signal


| Description       | Aspect                                  | Meaning |
|---------------|--------------------------------------------|--------------|
| Combination signal | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_multiblocksignal.png" width="50px">}} | combination signals have the function of both main signal and distant signal |
| main signal | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_mainsignal.png" width="50px" >}} | main signals indicate whether the track section ahead may be run over  |
| distant signal | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_distantsignal.png" width="50px" >}} | Distant signals indicate which signal aspect is to be expected at the corresponding next main signal. </br>These are positioned at the braking distance from the next main signal |
| Stop (Hp 0) | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_multiblocksignal_Hp0.png" width="50px" >}} | the signal prohibits the passing of a train  |
| Clear (Ks 1) | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_multiblocksignal_Ks1.png" width="50px" >}} | 1. The signal permits the passing at the maximum speed allowed on the section, unless a speed restriction is indicated by a speed indicator.</br>2. The green luminous spot blinks if a distant speed indicator shows in the signal, indicating a speed restriction at the next main signal |
| Expect Stop (Ks 2) | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Ks_multiblocksignal_Ks2.png" width="50px" >}} | the signal permits the passing and indicates a stop at the next main signal |

*based on: Bailey(1995), European Railway Signalling, p58; sprites from https://github.com/Nakaner/railway-signals.git*

## Speed Indicators in the Ks-Signalling System

The Ks system includes specific indicators to communicate speed restrictions to train drivers.

### Speed Indicator (Zs 3)
- The speed displayed by the **Zs 3** indicator defines the maximum permissible speed from the signal onward, specifically within the subsequent switch area.  
- The numeric value shown on the indicator represents the allowed speed in kilometers per hour, calculated as **10 times the displayed number**.

### Distant Speed Indicator (Zs 3v)
- *means: expect speed indicator Zs 3*
- The **Zs 3v** indicator provides advance notice of a speed restriction at the next main signal.  
- Similar to the Zs 3 indicator, the displayed number corresponds to a permissible speed of **10 times the value in km/h** at the upcoming main signal.

*Source: DB AG, Ril 301 Signalbuch*

| Aspect | Form | Light| Corresponding speed-limit|
|-----------|-----------|----------|-------------|
|Zs 3|  {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Zs3F_80.png" width="80px" >}}  | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Zs3_80.png" width="60px" >}} | 80 km/h from this signal |
|Zs 3v| {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Zs3vF_80.png" width="80px" >}} | {{< figure src="/images/docs/railway-wiki/signalling/ks-signalling/Zs3v_80.png" width="60px" >}} | 80 km/h from the corresponding main signal |

*sprites from https://github.com/Nakaner/railway-signals.git*
 