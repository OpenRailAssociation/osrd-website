---
title: "How to generate infrastructure from OSM"
linkTitle: "How to generate infrastructure from OSM"
weight: 10
description: Describe the steps to generate an infrastructure from OSM data
---

1. On [geofabrik](https://download.geofabrik.de), download the `.osm.pbf` file corresponding to the area you want. Here we take Germany as an example.

    This is not mandatory, but using [osmium](https://osmcode.org/osmium-tool/) is strongly recommended to filter the `.osm.pbf` file with only the railway-related data needed by osm_to_railjson. The tag `railway` is used on nodes, ways and relations, and the tag `public_transport=stop_area` is used on relations.
    This can divide by 3 the time taken by the osm_to_railjson generation.
    ```sh
    osmium tags-filter <path/to/germany.osm.pbf> nwr/railway r/public_transport=stop_area -o <path/to/germany.osm.pbf>
    ```

2. Launch conversion (release build of editoast and conversion can be long):
    ```sh
    cd ../../editoast
    cargo run --release -p osm_to_railjson -- <path/to/germany.osm.pbf> <path/to/germany_railjson.json>
    ```
    Depending on the area, signals data can be missing. If so, the `--generate-signals` option overrides the potential existing signals with [automatically generated realistics ones](/en/docs/reference/design-docs/osm-to-railjson#signal-generation).

3. Load the generated railjson, either using [load-railjson-script.sh](https://github.com/OpenRailAssociation/osrd/blob/dev/scripts/load-railjson-infra.sh) or OSRD's web interface:
    ```sh
    cargo run --release -- infra import-railjson --generate "Germany_OSM" <path/to/germany_railjson.json>
    ```
