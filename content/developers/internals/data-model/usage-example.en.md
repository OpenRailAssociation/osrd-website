---
title: "Usage Example"
linkTitle: "Example"
weight: 20
description: "OSRD data format usage example"
---

## Introduction

This page gives an example of how the data formats are used to describe an infrastructure (and rolling stocks and schedules) in *OSRD*.

For this purpose, let's take as an example the following toy infrastructure:

![Toy infrastructure schema](../svg_schemas/small_infra_schema.en.svg)

In this schema we represent the overall look of the infrastructure with just the lines and the stations.

This is obviously not a realistic infrastructure, but it will allow us to present the data models in a simple way.

We will build the details of the infrastructure step by step, and present the objects used at each step.

In the *OSRD* repository, you will find [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py), a file allowing to generate the infrastructure that we will describe, and use it in OSRD. For more information about the generation scripts, you can checkout the related [README](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/README.md).

## The rails

### Track sections

<span style="color: red">I feel like there is quite some mixup between Track and `TrackSection` here</span>

The first objects that we need to define are the `TrackSection`s. Most other objects are defined in relation to the track sections we have set up.

A track section is simply a portion of rail (switches not included). One can chose to divide the tracks of their infrastructure in as many track sections as they like. Here we chose to use the longest track sections possible, which means that between two switches there is always a single track section.

A train runs on one track section, if you want to run trains in opposite directions at the same time and on the same line, you need to define at least two parallel track sections.

For our example, we will define two tracks for the line between the West and North-East stations.

Furthermore, we will add overpassing tracks at the North and Mid-West stations, to make our infrastructure a bit more realistic.

We will also have three different tracks in the West station, since it's a major hub in our imaginary infrastructure.

Here are the track sections that we then need:

![Track sections schema](../svg_schemas/small_infra_rails.en.svg)

They are represented as arrows in our schema to stress the fact that they have a **start** and an **end**. This is important because the objects related to the track section are positioned using an offset, and the offset is a distance from the **start** of the track section.

For the objects to be complete, there are different attributes to set:

* `length`: the length of the track section in meters.
* `geo`: the coordinates in real life (geo is for geographic), in the [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) format.
* `sch`: the coordinates in the schematic view (sch for schematic), also in [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) format.
* cosmetic attributes: `line_name`, `track_name`, `track_number` which are used to indicate the name and labels that were given to the tracks / lines in real life.

For all track sections, the `geo` and `sch` attributes are identical, and very much resemble the given schema.

For most track sections, their `length` is proportional to what can be seen in the schema, but for readability, we made *TA6*, *TA7*, *TD0* and *TD1* not correspond to their length (which are 10km and 25km).

### Buffer stops

The buffer stops are physical objects that prevent trains from leaving the rails.

In our infrastructure, there is a buffer stop on each track section which has a loose end. There are therefore 8 buffer stops in total.

<span style="color: red">Do I have anything more to say ?</span>

### Curves and slopes

<span style="color: red">Do I need to represent them on a schema ? Or to plot the slopes ?</span>

Curves and slopes are necessary in order to represent the real world conditions in our simulation. These objects are defined as a range between two offsets of a track section.

The slope / curve value that one wants to set is constant on the whole range. For varying curves / slopes, one needs to create several objects.

In the [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py) file, we have slopes on the track sections *TA6*, *TA7*, *TD0* and *TD1*.

There are curves as well, on the track sections *TE0*, *TE1*, *TE3* and *TF1*.

### Track Section Links

<span style="color: red"> Maybe talk about Route here, or at least put a link to the section</span>

For the moment we only created track sections, they have length and coordinates but they are not linked to each other (we do not check which coordinates overlap, thank you very much). We simply indicate the link between two track sections by creating an object, linking one extremity to the other.

Since we chose to have long track sections, we only have to link them at switches. Happily, in our generation scripts, like in [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py), when creating switches, the corresponding `TrackSectionLink`s are automatically created.

If two track sections are not connected by a `TrackSectionLink`, a train in an *OSRD* simulation cannot go from the one to the other.

### Switches

For the time being, OSRD implements three types of switches (which we will all use in our example). Let us first define these three types of switches.

#### Point Switch

This is the most standard kind of switch and can be conceived as two tracks merging into one, or one track splitting into two. For example, the following switch *PA0* links *TA1* to *TA3* and *TA1* to *TA4*.

![Point switch schema](../svg_schemas/point_switch.en.svg)

At any given moment, a train can be able to go from *TA1* to *TA3* or from *TA1* to *TA4* but never to both at the same time. A Point Switch only has two positions:

![Point switch positions schema](../svg_schemas/point_switch_positions.en.svg)

#### Cross Switch

This is simply two tracks crossing each other. For example, the following switch *PD1* links *TD1* to *TD3* and *TF0* to *TF1*.

![Cross switch schema](../svg_schemas/cross_switch.en.svg)

This is a switch in the sense that there are only two situations: the train can go from *TD1* to *TD3* or it can go from *TF0* to *TF1* but not both at the same time.
Illustrated here:

![Cross switch positions schema](../svg_schemas/cross_switch_positions.en.svg)

#### Double Cross Switch

This one is more like two point switches back to back. Therefore it has four positions. For example the following switch *PH0* links *TG0*, *TG1*, *TD3* and *TH0*.

![Double cross switch schema](../svg_schemas/double_cross_switch.en.svg)

And here are its four possible positions:

![Double cross switch positions schema](../svg_schemas/double_cross_switch_positions.en.svg)

#### Back to the example

In most places we use the classical point switch. To go from North to South station we added two cross switches, and we added one double cross switch right before the main line splits to go to the north-East and South-East stations. Here is the schema of the infrastructure, with all switches:

![Track sections and points schema](../svg_schemas/small_infra_rails_n_points.en.svg)

## The signaling

We have now completely represented our railways. Trains could now run on our infrastructure, however, it would be highly unsecure as no object ensuring the safety of the trains has been declared for the moment. Let's fix that.

### Detectors

These objects allow to know where the trains are and must be placed regularly on the tracks. Most particularly, we need to add detectors at the entrance of switches, as to not block too many track sections at once. <span style="color: red">No idea what to say, am i supposed to explained this ?</span>.

Here you can see all the spots where we placed detectors in our infrastructure, represented by green squares. We need not include their `id` for readability.

![Infra schema with all detectors](../svg_schemas/small_infra_detectors.en.svg)

The clumped up squares represent many detectors at once. Indeed, because some track sections are not represented with their full length, we could not represent all the detectors on the corresponding track section.

**NB:**

* Between some points, we added only one detector (and not two), because they were really close by, and it would have made no sense to protect (<span style="color: red">should explain ?</span>) the tiny portion of rail between the two. This situation happened on track sections (*TA3*, *TA4*, *TA5*, *TF0* and *TG3*)

* On some track sections, we added more detectors than what was strictly necessary to protect (<span style="color: red">same</span>) the switches. Namely, *TA6*, *TA7*, *TDO*, *TD1*, *TF1*, *TG1* and *TH1*. If we did not add those detectors, the whole track sections would be reserved as soon as one train would be present on it, which is inefficient for those long track sections. For example  *TD0*, which measures 25km, has in fact 17 detectors in total.

### Signals

Now, thanks to the detectors we can know where our trains are in our infrastructure. However, this is useless if we cannot tell the trains not to go into a track section where there already is a train. This where the signals come into play.

A signal is used to tell a train wether to stop or to go. <span style="color: red">not all signal do that, do they ?</span>

There are different type of signals <span style="color: red">no idea what to say there</span>.

Here are the most important attributes for the signals:

* `linked_detector`: The detector it is linked to (<span style="color: red">Is it a necessary attribute ?</span>)
* `type_code`: The type of signal (redundant)
* `direction`: The direction it protects, which can simply be interpreted as the way in which it can be seen by an incoming train (since there are lights only on one side...).
* Cosmetic attributes like `angle_geo` or `side` which control the way in which the signals are displayed in the *OSRD*
 front.

We add two signals for each detector that are simply cutting the train sections into smaller TIV (<span style="color: red">is it ?</span>), one in each direction.

For detectors protecting the entry of switches, we only need to add one signal, visible in the direction from which you enter the switch. Indeed, you do not need to be able to stop trains coming out of switches: if you prevent a train from coming out of a switch, it becomes unusable.

For the detectors that are in between two switches, we do not add signals, because stopping a train between the two switches would mean stopping the train inside one of the switches.

Here is a visualization of how one can represent a signal, and which direction it protects.

<img alt="Signal direction example" src="../svg_schemas/signal_dir.en.svg" width=400>

<br />
<br />
<br />

And there we have all the signals placed. Please note that we do not represent detectors that are linked to at least one signal.
To get the `id` of a detector linked to a signal, take the signal's `id` and replace *S* by *D* (e.g. SA0 -> DA0).

![Infra schema with all signals](../svg_schemas/small_infra_signals.en.svg)

## Last objects

Now we have represented all the material parts of our infrastructure <span style="color: red">really ?</span>. But there are still concepts that we may want to represent.

### Speed sections

The Speed sections represent speed limitations (in meters per second) that are applied on some parts of the tracks. One speed section can span on several track sections, and do not necessarily cover the whole track sections. Speed sections can overlap.

In our example infrastructure, we have a speed section covering the whole infrastructure, limiting the speed to 300 km/h. On a smaller part of the infrastructure, we applied more restrictive speed sections. They are represented on the next image.

![Speed section examples](../svg_schemas/speed_sections.en.svg)

### Operational points

Operational points represent anything that we find of interest and want to represent in our simulation. An operational point is mostly constituted of the list of its parts, which are simply positions on track sections.

For example, we might find convenient to have the position of the platforms actually integrated in our system. For that purpose, we can represent them as operational points. In our example infrastructure, they are the only operational points used. The operational point parts are represented by purple diamonds in the following schema, the operational points they are related to are simply the names they are close by.

![Operational points examples](../svg_schemas/operational_points.en.svg)

## Paths ?

## Train Schedules ?
