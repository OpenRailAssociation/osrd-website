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

There are different attributes to set:

* `length`: the length of the track section in meters
* `geo`: the coordinates in real life (geo is for geographic)
* `sch`: the coordinates in the schematic view (sch for schematic)
* cosmetic attributes: `line_name`, `track_name`, `track_number` which are used to indicate the name and labels that were given to the tracks / lines in real life.

They are represented as arrows in our schema to stress the fact that they have a start and an end. This is important because the objects related to the track section are positioned using an offset, and the offset is a distance from the start of the track section.

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

### Detectors

### Signals

## Last objects

### Speed sections

### Operational points

## Routes

## Trains ?

<span style="color: red"> No idea what to say</span>

