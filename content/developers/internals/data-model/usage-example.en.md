---
title: "Usage Example"
linkTitle: "Example"
weight: 20
description: "OSRD data format usage example"
---

## Introduction

This page gives an example of how the data formats are used to describe an infrastructure (and rolling stocks and schedules) in *OSRD*.

For this purpose, let's take as an example the following toy infrastructure:

![Toy infrastructure schema](../svg_schemas/small_infra_schema.drawio.en.svg)

{{% alert title="Tip" color="info"%}}
In case you want to zoom in on schemas, you can click on the little editing button that appears when hovering the mouse on it.
{{% /alert %}}

In this schema we represent the overall look of the infrastructure with just the lines and the stations.

This is obviously not a realistic infrastructure, but it will allow us to present the data models in a simple way.

We will build the details of the infrastructure step by step, and present the objects used at each step.

### The infrastructure generator

In the [*OSRD* repository](https://github.com/DGEXSolutions/osrd) is a [python module](https://github.com/DGEXSolutions/osrd/tree/dev/core/examples/generated) that allows for generating infrastructures in a format understood by *OSRD*.

The infrastructure we talk about in this page can be generated through the [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py) file. For more information about the generation scripts, you can check out the related [README](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/README.md).

## The rails

### Track sections

The first objects that we need to define are the `TrackSection`s. Most other objects are defined in relation to the track sections we have set up.

A track section is simply a portion of rail (switches not included). One can chose to divide the tracks of their infrastructure in as many track sections as they like. Here we chose to use the longest track sections possible, which means that between two switches there is always a single track section.

A train runs on one track section, if you want to run trains in opposite directions at the same time and on the same line, you need to define at least two parallel track sections.

For our example, we will define two tracks for the line between the West and North-East stations.

Furthermore, we will add overpassing tracks at the North and Mid-West stations, to make our infrastructure a bit more realistic.

We will also have three different tracks in the West station, since it's a major hub in our imaginary infrastructure.

Here are the track sections that we then need:

![Track sections schema](../svg_schemas/small_infra_rails.drawio.en.svg)

{{% alert title="Important" color="warning"%}}
They are represented as arrows in our schema to stress the fact that they have a **start** and an **end**. This is important because the objects related to the track section are positioned using an offset, and the offset is a distance from the **start** of the track section.

Therefore, if you want to place an object at the beginning of the track section, you would set its offset to 0. To place it at the end of the track section, its offset should be the `length` of the track section.
{{% /alert %}}

For the objects to be complete, there are different attributes to set:

* `length`: the length of the track section in meters.
* `geo`: the coordinates in real life (geo is for geographic), in the [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) format.
* `sch`: the coordinates in the schematic view (sch for schematic), also in [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) format.
* cosmetic attributes: `line_name`, `track_name`, `track_number` which are used to indicate the name and labels that were given to the tracks / lines in real life.

For all track sections in our infrastructure, the `geo` and `sch` attributes are identical, and very much resemble the given schema.

For most track sections, their `length` is proportional to what can be seen in the schema, but for readability, we made *TA6*, *TA7*, *TD0* and *TD1* not correspond to their length (which are 10km and 25km).

### Track Section Links

For the moment we only created track sections, they have length and coordinates but they are not linked to each other (we do not check which coordinates overlap, thank you very much). We simply indicate the link between two track sections by creating an object, linking one extremity to the other.

If two track sections are not connected by a `TrackSectionLink`, a train in an *OSRD* simulation cannot go from the one to the other.

In our example, creating the links is straight-forward: since we chose to have long track sections, we only have to link them at switches. Happily, in our generation scripts, like in [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py), when creating switches, the corresponding `TrackSectionLink`s are automatically created.

Let's delve a bit on the switches.

### Switches

<!-- TODO: what it is -->
The switches are the parts needed to link more than two different track sections together.

A switch manages the different links that are associated to it (always at least two). In general, it translates into the following rule: when one link is used, the others cannot be used at the same time. This is because if two links were used by trains at the same time, it would be an accident.

Since the kinds of links that we need to create at a switch often happen to be redundant, we have `SwitchType` objects, which gather what links should be created, when creating this particular type of switch. We will describe this object in the next subsection.

<!-- TODO: how it's implemented -->
<!-- TODO: how we use it -->

#### Switch Types

A switch type contains two attributes:

* `ports`: A list of names, that will be used to reference the ports. It is best described by example (see next paragraph).
* `groups`: A mapping from group names to lists of connections between two ports. When one group is active, only the connections in its list are active.

In *OSRD*, we currently use three switch types.

**1) Point Switch**

This is the most standard kind of switch and can be conceived as two tracks merging into one, or one track splitting into two.

This switch type has three ports: *base*, *left* and *right*.

![Point switch schema](../svg_schemas/point_switch.en.svg)

There are two groups, each with one connection in their list: `LEFT`, which links *base* to *left*, and `RIGHT` which links *base* to *right*.

Thus, at any given moment, a train can be able to go from *base* to *left* or from *base* to *right* but never to both at the same time. A train cannot go from *left* to *right*.

A Point Switch only has two positions:

![Point switch positions schema](../svg_schemas/point_switch_positions.en.svg)

**2) Cross Switch**

This is simply two tracks crossing each other.

This type has four ports: *north*, *south*, *east* and *west*.

![Cross switch schema](../svg_schemas/cross_switch.en.svg)

It has two groups containing each one connection: *north* to *south* and *west* to *east*. Thus the cross switch has two positions, as shown here:

![Cross switch positions schema](../svg_schemas/cross_switch_positions.en.svg)

**3) Double cross switch**

This one is more like two point switches back to back. It has four ports: *south1*, *south2*, *north1* and *north2*.

![Double cross switch schema](../svg_schemas/double_cross_switch.en.svg)

However, it has four groups, each with one connection. The four groups are represented in the following schema:

![Double cross switch positions schema](../svg_schemas/double_cross_switch_positions.en.svg)

#### Back to switches

A switch has two main attributes:

* `switch_type`: the switch type we have chosen for this switch
* `ports`: a mapping from port names to track sections extremities.

The port names must correspond to the ports of the switch type chosen. The track section extremities can be start or end, it doesn't matter.

Concerning our example: in most places we use the classical point switch. To go from North to South station we added two cross switches, and we added one double cross switch right before the main line splits to go to the north-East and South-East stations. Here is the schema of the infrastructure, with all switches:

![Track sections and points schema](../svg_schemas/small_infra_rails_n_points.drawio.en.svg)

## The signaling

We have now completely represented our railways. Trains could now run on our infrastructure, however, it would be highly unsecure as no object ensuring the safety of the trains has been declared for the moment. Let's fix that.

### Detectors

These objects are used to create TVDS (Track Vacancy Detection Section): the portion of rails between two detectors (or between a detector and a buffer stop) is a TVDS. When a train activates a detector, the detectors declares its TVDS occupied, and no other train is allowed to enter this TVDS. This also allows to locate trains, since you know in which TVDS there are trains.

In real life, detectors can be [axle counters](https://en.wikipedia.org/wiki/Axle_counter) or [track circuits](https://en.wikipedia.org/wiki/Track_circuit) for example.

In order for this system of localization to be efficient, you have to place detectors regularly along your tracks, not too many because that is costly, but not too few, because then TVDS would be very large and trains would need to be very far apart, which is not ideal.

On another note, some detectors are often placed close to switches, in order to have small TVDS specifically for switches. This is useful because the shorter the TVDS, the faster the trains evacuate it, and the faster the switch is free to be used again.  

{{% alert title="" color="info"%}}
Let's take a cross switch as an example: if train A is crossing it *north* to *south* and train B is coming to cross *west* to *east*, then as soon as train A's last car has passed the crossing, B should be able to go, since A is now on a completely unrelated track section.
{{% /alert %}}

In *OSRD*, detectors are punctual objects, so all the attributes needed are its `id`, and a position on a track section (`track` and `offset`).

Here you can see all the spots where we placed detectors in our infrastructure, represented by green squares. We need not include their `id` for readability.

![Infra schema with all detectors](../svg_schemas/small_infra_detectors.drawio.en.svg)

The clumped up squares represent many detectors at once. Indeed, because some track sections are not represented with their full length, we could not represent all the detectors on the corresponding track section.

**NB:**

* Between some points, we added only one detector (and not two), because they were really close together, and it would have made no sense to create a tiny TVDS between the two. This situation happened on track sections (*TA3*, *TA4*, *TA5*, *TF0* and *TG3*).
* In our infrastructure, there is relatively few track sections which are long enough to require more detectors than just those related to switches. Namely, *TA6*, *TA7*, *TDO*, *TD1*, *TF1*, *TG1* and *TH1*. For example  *TD0*, which measures 25km, has in fact 17 detectors in total.

### Signals

Now, thanks to the detectors we can know where our trains are in our infrastructure. However, this is useless if we cannot tell the trains not to go into a track section where there already is a train. This is where the signals come into play: a signal is used to tell a train wether it has to stop or to keep going.

Here are the most important attributes for the signals:

* `linked_detector`: The detector it is linked to.
* `type_code`: The type of signal.
* `direction`: The direction it protects, which can simply be interpreted as the way in which it can be seen by an incoming train (since there are lights only on one side...).
* Cosmetic attributes like `angle_geo` or `side` which control the way in which the signals are displayed in the *OSRD*
 front.

In our example infra, we add two signals for each detector that are simply cutting the train sections into smaller TVDS, one in each direction.

For detectors marking the entry of switches, we only need to add one signal, visible in the direction from which you enter the switch. Indeed, you do not need to be able to stop trains coming out of switches: if you prevent a train from coming out of a switch, it becomes unusable.

For the detectors that are in between two switches, we do not add signals, because stopping a train between the two switches would mean stopping the train inside one of the switches.

Here is a visualization of how one can represent a signal, and which direction it protects.

<img alt="Signal direction example" src="../svg_schemas/signal_dir.en.svg" width=400>

<br />
<br />
<br />

And there we have all the signals placed. Please note that we do not represent detectors that are linked to at least one signal.
To get the `id` of a detector linked to a signal, take the signal's `id` and replace *S* by *D* (e.g. SA0 -> DA0).

![Infra schema with all signals](../svg_schemas/small_infra_signals.drawio.en.svg)

## Physical objects

### Buffer stops

The buffer stops are physical objects that prevent trains from leaving the rails.

In our infrastructure, there is a buffer stop on each track section which has a loose end. There are therefore 8 buffer stops in total.

Together with detectors, they form the [TVD](https://ressources.data.sncf.com/explore/dataset/lexique-des-acronymes-sncf/table/?sort=abreviation&q=TVD) sections of our system (see [Detectors](#detectors))

### Curves and slopes

Curves and slopes are necessary in order to represent the real world conditions in our simulation. These objects are defined as a range between a `begin` and `end` offsets of one track section. If you want to have a curve / slope value that spans over more than one track section, you need to have one objects for each track section it covers.

The slope / curve value that one wants to set is constant on the whole range. For varying curves / slopes, one needs to create several objects.

{{% alert title="" color="primary"%}}
Mind that the `begin` value should always be smaller than the `end` value. That is why the curve / slope values can be negative: an uphill slope of 1 going from offset 10 to 0 is the same as a downhill slope of -1 going from offsets 0 to 10.
{{% /alert %}}

In the [small_infra.py](https://github.com/DGEXSolutions/osrd/blob/dev/core/examples/generated/scripts/small_infra.py) file, we have slopes on the track sections *TA6*, *TA7*, *TD0* and *TD1*.

There are curves as well, on the track sections *TE0*, *TE1*, *TE3* and *TF1*.

### Operational points

Operational points represent anything that we find of interest and want to represent in our simulation. An operational point is mostly constituted of the list of its parts, which are simply positions on track sections.

For example, we might find convenient to have the position of the platforms actually integrated in our system. For that purpose, we can represent them as operational points.

In our example infrastructure, they are the only operational points used. The operational point parts are represented by purple diamonds in the following schema, the operational points they are related to are simply the names they are close by.

![Operational points examples](../svg_schemas/operational_points.drawio.en.svg)

## Other objects

Now we have represented all the material parts of our infrastructure <span style="color: red">really ?</span>. But there are still concepts that we may want to represent.

### Loading Gauge Limits

These objects are akin to Slopes and Curves: it covers a range of track section, with a `begin` and an `end` offset. It represents a restriction on the trains that can travel on the given range, by weight or by train type (freight or passenger).

We did not put any in our examples.

### Speed sections

The Speed sections represent speed limitations (in meters per second) that are applied on some parts of the tracks. One speed section can span on several track sections, and do not necessarily cover the whole track sections. Speed sections can overlap.

In our example infrastructure, we have a speed section covering the whole infrastructure, limiting the speed to 300 km/h. On a smaller part of the infrastructure, we applied more restrictive speed sections. They are represented on the next image.

![Speed section examples](../svg_schemas/speed_sections.en.svg)

### Routes

A `Route` in OSRD represents a trajectory a train take. It is represented with the following attributes:

* `entry_point` and `exit_point`: in *OSRD* those are generally references to detectors or buffer stops.
* `path`: The list of track section ranges a train can pass on to go from entry to exit. There can be two Routes with the same entry and exit points and two different paths.
* `release_detectors`: The list of detectors that can be released after the train has crossed them. This allows for "hard" reservation when the list is empty and "soft" when the list contains all the detectors seen along the way.

In our infrastructure, all possible routes were generated automatically by the script.
