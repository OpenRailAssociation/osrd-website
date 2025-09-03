---
title: "Sub category"
linkTitle: "Sub category"
weight: 60
description: "Sub categories help organize and visually distinguish train schedules and paced trains when displayed in OSRD and NGE."
---

## Introduction

Sub categories are created via a dedicated API. Each sub category includes:

  - A name and a unique code,
  - Visual properties like **color**, **hovered_color**, and **background_color**,
  - A link to a parent main category.

### SubCategory model

```yml
name: "RER"
code: "RER"
main_category: "COMMUTER_TRAIN"
color: "#FF0000"
hovered_color: "#FFA500"
background_color: "#FFD700"
```

## Main Train Category in Rolling Stocks

The main train category defines the general type or purpose of a train.
It is used to classify trains into broad groups such as:
  - HighSpeedTrain – for long-distance high-speed services
  - FreightTrain – for goods and cargo transportation
  - ...

The RollingStock model includes a primary_category field to indicate which main category it belongs to:
```yml
primary_category: "HIGH_SPEED_TRAIN"
```

This category helps ensure consistency between the train schedule and the rolling stock, and is also used for visual display and filtering in the UI.

⚠️ If a train schedule or paced train specifies a main category, or a sub category whose parent category differs from the rolling stock’s primary category, a warning is displayed.

### Train Schedule & Paced Train Category

The category field in train schedules and paced trains can take either:

```yml
category:
  main_category: "COMMUTER_TRAIN"
```

Or

```yml
category:
  sub_category_code: "RER"
```

Both **TrainSchedules** and **PacedTrains** can specify either a **main category** or a user-defined **sub category**.

When a subcategory is deleted, any train schedules and paced trains using it will automatically fall back to its associated parent category.

![sub category diagram](sub_category.svg)

## Sub categories Api

### Create sub categories

Creates one or more sub categories in batch.

```
POST /api/sub_category
```

Request body: array of sub category objects.

### Retrieve sub categories

Retrieves paginated sub categories.

```
GET /api/sub_category?page=1&page_size=1000
```

### Delete sub categories

Deletes a sub category using its code.

```
DELETE /sub_category/:code
```
