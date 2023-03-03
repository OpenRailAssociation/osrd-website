---
title: "OpenStreetMap and open data talk at Fosdem 2023"
linkTitle: "OpenStreetMap and open data talk at Fosdem 2023"
date: 2023-02-03
---

Hi ! My name is Céline, and I am on a mission to bring more open data into OSRD. To do so, I searched open data that can fit OSRD's needs in every country of the European Union (+ Norway, United Kingdom and Switzerland).

I have presented the main results of this study during a talk at the FOSDEM 2023 meeting, and you can see the replay on [their website](https://fosdem.org/2023/schedule/track/railways_and_open_transport/).

In this post I will go into details of the methodology I followed, feel free to contact me if you have any remarks or question :-)

### Data download
You can download the detailed data I created [here](/files/EU-open-data.xlsx).

The file is composed of three tabs:
- EU-sources: links to download each country's open data & info on license compatibility
- EU-data: data used to compare total track length between countries and source and to compute the "usability indicator" 
- EU-epsg: [EPSG](https://en.wikipedia.org/wiki/EPSG_Geodetic_Parameter_Dataset) code used for reprojecting geographical data for each country

### Compare total track length
#### Calculate track length from open data
- Look for open data sources
- If a source is found, look for data license
- Check license compatibility with OpenStreetMap using [OSM wiki](https://wiki.openstreetmap.org/wiki/Import/ODbL_Compatibility) and [this blog post](https://blog.openstreetmap.org/2017/03/17/use-of-cc-by-data/)
- Download open data
- Load data into [QGIS](https://qgis.org/en/site/) and reproject it based on the EU-epsg tab
- Calculate a new field using the following formula to get the length of each track in kilometers:

        "length" = $length / 1000 
- Report total length using the "Basic Statistics for Fields" tool

Learn more about [Inspire data model](https://inspire.ec.europa.eu/file/1723/download?token=0GOYYbMF)
#### Calculate track length for OpenStreetMap data
- Download last OSM export from https://download.geofabrik.de/europe.html
- Load lines data into QGIS
- Select data using the "other_tags" field to select railway network: 

        "other_tags" like '%"railway"=>"rail"%'
        or "other_tags" like '%"railway"=>"narrow_gauge"%'
        or "other_tags" like '%"railway"=>"light_rail"%'
- Export selected objects and reproject the layer based on the EU-epsg tab
- Calculate a new field using the following formula to get the length of each track in kilometers:

        "length" = $length / 1000 
- Select electrified parts of the network using the "other_tages" field: 

        "other_tags" like '%"electrified"=>"yes"%'
        or "other_tags" like '%"electrified"=>"contact_line"%'
        or "other_tags" like '%"electrified"=>"rail"%'
- Report total length using the Basic Statistics for Fields tool


Learn more about [OpenStreetMap data model](https://wiki.openstreetmap.org/wiki/OpenRailwayMap/Tagging)

### Calculate usability indicator
- List required and optional data
- For each data, indicate its availability using QGIS ([Overpass Turbo](https://overpass-turbo.eu/) can also be helpful to check OSM data) and the following scale :
  - "Yes": fully available
  - "Partial": not available everywhere on the country, or missing parts of the data
  - "No": not available
- Sum total required and optional data with Yes = 1; Partial = 0.5; No = 0
- Generate indicator: 
  - "Good" if required=2 and optional>2
  - "Okay" if required >1 and optional >=0
  - "Poor" if required=1 and optional >2
  - "Not usable" else

### Map the result
To show the indicator and license compatibility on a map, use the [Eurostat borders datasets](https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/countries) (for my presentation, I have used the 1:20 million scale and EPSG:3035) and join the table using countries names.
