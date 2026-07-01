---
title: "OpenStreetMap infrastructures"
linkTitle: "OpenStreetMap infrastructures"
weight: 10
description: Generate an infrastructure using open data from OSM with our [osm-to-railjson](https://github.com/OpenRailAssociation/osrd/tree/dev/editoast/osm_to_railjson) tool
---

As detailed [here](https://osrd.fr/en/docs/explanation/models/data-models-full-example/), in order to benefit from all OSRD functionalities, the following objects are required:
 
- Track sections
- Switches
- Curves and slopes
- Signals and detectors
- Routes
- Electrifications
- Operational points
- Loading gauges
- Speed sections

For SNCF Réseau production environments, this data is sourced from internal private databases and is then transformed into the railjson format using closed-source code.
For another railway infrastructure manager owning this data for its own area of operation, this can be done as well.
However, to let anyone (including people outside of the railway infrastructure industry) try and improve OSRD, we have developed an algorithm that generates a realistic infrastructure using OpenStreetMap tracks as only input. It is important to note that this infrastructure is realistic and not real.
This allows to easily generate a real-looking infrastructure for any place in the world!

As a demonstration, such generated infrastructures (France, Belgium and Morocco) are available in the public [demo website](https://demo.osrd.fr).
