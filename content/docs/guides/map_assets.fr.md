---
title: "Données cartographiques externes"
linkTitle: "Données cartographiques externes"
weight: 10
description: "Comment fabriquer et utiliser les données cartographiques externes nécessaires à OSRD"
---

L'utilisation et la fabrication de cartographie pour le web est aujourd'hui (2023) grandement simplifiée par rapport à une époque où il était question de mettre en place un serveur web qui proposent des tuiles raster pré-générées.

Nous avons fait le choix d'utiliser la solution MapLibre pour l'affichage des cartes et notamment des fonds de carte dont il est l'objet ici, notamment venant d'OpenStreetMap.

### Le format de fichier MBTILES

https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md

### Générer le fond de carte OSM

### Générer les données d'élévation (relief, ombrage ou 3D)

Quelques étapes, simples mais délicates, suffisent :
- récupérer les données en plusieurs secteurs
- les convertir en plusieurs MBTILES
- fusionner les fichiers MBTILES

NOUVELLE MANIERE
- convertir le nodata 
`gdal_translate -of GTiff -a_nodata 0 ../../temp/EU-DEM-TIF/eu_dem_v11_E20N40.TIF E20N40-NODATA-0.TIF`
- convertir en rgb
`rio rgbify -b -10000 -i 0.1 -j 9 E20N40-NODATA-0.TIF E20N40-RIO.tif`
- fusionner GeoTiff
?
- convertir en mbtiles
`gdal_translate -of mbtiles E20N40-RIO.tif E20N40-RIO.mbtiles`
- ajouter les autres niveaux
`gdaladdo E20N40-RIO.mbtiles 2 4 8 16 32`

#### Récupérer les données EU-DEM

https://land.copernicus.eu/imagery-in-situ/eu-dem/eu-dem-v1-0-and-derived-products/eu-dem-v1.0

Les données de relief, un pixel pour 25m, sont fournies par le _Land Monitoring Service_ programme européen pour permettre la surveillance des données terrestres par l'observation sattelite. Il faut s'inscrire pour avoir accès aux liens de téléchargement, les données sont libres d'usage à condition de mentionner l'attribution (cf FAQ).

Les données sont au format GeoTIFF sectorisées sur l'échelle du continent.

> **Ne prenez pas le fichier global contenant toute l'Europe**
>
> Effectivement, il **faut** télécharger l'ensemble des secteurs, soit une vingtaine de fichiers et pas le fichier unique, car il ne sera pas possible de le traiter efficacement.

Une fois l'ensemble des fichiers téléchargés, **environ 50Go**, décompressez-les dans un seul répertoire

#### Conversion GeoTIFF vers MBTILES

On utilise la fonction `rgbify` de l'outil [rio-rgbify](https://github.com/mapbox/rio-rgbify) avec la commande suivante :

```
rio rgbify -b -10000 -i 0.1 --min-z 0 --max-z 12 -j 12 --format png EUD_CP-DEMS_2500045000-AA.tif output.png.mbtiles
```

Le fichier d'entrée est `EUD_CP-DEMS_2500045000-AA`.

`--max-z` est le niveau de zoom maximum, inutile d'aller plus loin, le niveau 12 correspond à 19m/pixel, nos fichiers sources sont à 25m/pixel ([source](https://docs.mapbox.com/help/glossary/zoom-level/)).

`-j 12` indique le nombre de threads à utiliser. Faites des tests en monitorant la consommation mémoire, vous aurez vite fait de dépasser.

La conversion est gourmande en mémoire et cpu, elle est cependant multithreadée. La taille du fichier ne conditionne pas le temps de traitement, c'est la **taille géographique de la zone** contenue qui est déterminante (c'est pour cela que prendre le fichier unique n'est pas gérable, il faudrait plus de 1To de mémoire).

À titre informatif, le temps de conversion et la consommation de ressources pour un fichier/secteur de cette surface :

| CPUs/Nombre de threads demandés | RAM consommée | Temps de traitement |
| ------------------------------- | ------------- | ------------------- |
| 12                              | 32Go          | 30min               |
| 128                             | 750Go         | 1min                |

La taille totale de l'ensemble des fichiers `.mbtiles` ainsi obtenus est de 40Go. Leur taille varie toujours en fonction de la quantité de données de la zone concernée (si beaucoup d'océan ce sera petit).

#### Fusionner les fichiers MBTILES

Vu le format de fichier, la fusion se fait simple à l'aide du script suivant qui crée un premier fichier MBTILES vide avec les bonnes metadatas adaptées, notamment l'attribution obligatoire, et fusionne chaque fichier un par un ; les mbtiles n'étant rien d'autre qu'un fichier sqlite, il s'agît simplement d'insérer les données de chaque fichier dans le fichier final.

L'opération de fusion prend environ 5 min et

patch merge
ajout metadata
dedoublonnage mbutil
ajout index

CREATE TABLE metadata (name text, value text);
CREATE UNIQUE INDEX name on metadata (name);
CREATE TABLE tiles_shallow (
  zoom_level integer,
  tile_column integer,
  tile_row integer,
  tile_data_id integer

  , primary key(zoom_level,tile_column,tile_row)

) without rowid
;
CREATE TABLE tiles_data (
  tile_data_id integer primary key,
  tile_data blob
);
CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);
CREATE VIEW tiles AS
select
  tiles_shallow.zoom_level as zoom_level,
  tiles_shallow.tile_column as tile_column,
  tiles_shallow.tile_row as tile_row,
  tiles_data.tile_data as tile_data
from tiles_shallow
join tiles_data on tiles_shallow.tile_data_id = tiles_data.tile_data_id;
INSERT INTO metadata (name, value) VALUES
('format', 'png'),
('name', 'EuropeTerrain20230817'),
('description, ''),
('version', '1'),
('type', 'baselayer'),
('center', '6.13026,55.55427,2'),
('bounds', '-34.49296,29.63555,46.75348,81.47299'),
('minzoom', '0'),
('maxzoom', '14'),
('attribution', '©European Union, Copernicus Land Monitoring Service 2023, European Environment Agency (EEA)');


format|pbf
center|6.13026,55.55427,2
bounds|-34.49296,29.63555,46.75348,81.47299
name|OpenMapTiles
description|A tileset showcasing all layers in OpenMapTiles. https://openmaptiles.org
attribution|<a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>
version|3.14.0
type|baselayer
minzoom|0
maxzoom|14
planetiler:version|0.6.0
planetiler:githash|72f86c8b6361f1b6ae80337220525333f943d7e9
planetiler:buildtime|2023-04-01T09:24:50.895Z
planetiler:osm:osmosisreplicationtime|2023-07-30T20:21:56Z
planetiler:osm:osmosisreplicationseq|3775
planetiler:osm:osmosisreplicationurl|http://download.geofabrik.de/europe-updates

format|png
name|
description|
version|1
type|baselayer

insert into metadata (name, value) VALUES ('center', '6.13026,55.55427,2'), ('bounds', '-34.49296,29.63555,46.75348,81.47299'), ('minzoom', '0'), ('maxzoom', '14'), ('attribution', '©European Union, Copernicus Land Monitoring Service 2023, European Environment Agency (EEA)');

https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md

SELECT * FROM tiles WHERE rowid > (SELECT MIN(rowid) FROM tiles t2 WHERE tiles.zoom_level = t2.zoom_level AND tiles.tile_column = t2.tile_column AND tiles.tile_row = t2.tile_row);
DELETE FROM tiles WHERE rowid > (SELECT MIN(rowid) FROM tiles t2 WHERE tiles.zoom_level = t2.zoom_level AND tiles.tile_column = t2.tile_column AND tiles.tile_row = t2.tile_row);
CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);

***************************************
SCRIPT SCRIPT SCRIPT
******************************************

#!/bin/sh
MIX=$1
FOLDER=$2
if [ -z "$MIX" ] || [ -z "$FOLDER" ]; then
    echo "Usage: merge [result] [source folder]"
    exit 1
fi

echo "
CREATE TABLE tiles (zoom_level integer, tile_column integer, tile_row integer, tile_data blob);
CREATE TABLE metadata (name text, value text);
CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);
INSERT INTO metadata (name, value) VALUES
('format', 'png'),
('name', 'EuropeTerrain20230817'),
('description', ''),
('version', '1'),
('type', 'baselayer'),
('center', '6.13026,55.55427,2'),
('bounds', '-34.49296,29.63555,46.75348,81.47299'),
('minzoom', '0'),
('maxzoom', '14'),
('attribution', '©European Union, Copernicus Land Monitoring Service 2023, European Environment Agency (EEA)');"\
| sqlite3 $MIX

mix () {
	FILESIZE=$(du -h $1 | cut -f1)
	echo "Patch $1 => $2 - $FILESIZE ..."
	echo "
	PRAGMA journal_mode=DELETE;
	PRAGMA page_size=80000;
	PRAGMA synchronous=OFF;
	ATTACH DATABASE '$1' AS source;
	INSERT OR REPLACE INTO tiles SELECT * FROM source.tiles;"\
#	WHERE NOT EXISTS (SELECT * FROM source, source.tiles WHERE 
#	tiles.zoom_level = source.tiles.zoom_level
#	AND tiles.tile_column = source.tiles.tile_column
#	AND tiles.tile_row = source.tiles.tile_row
#	AND LENGTH(tiles.tile_data) > LENGTH(source.tiles.tile_data))
#	;"\
	| sqlite3 $2
}

find $FOLDER -type f -name "*.mbtiles" | while read source; do mix $source $MIX; done








### Fonds de cartes externes (IGN)
