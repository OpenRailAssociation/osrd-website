---
title: "Sub category"
linkTitle: "Sub category"
weight: 60
description: "Describes the sub-category model and its relation to train schedules and paced trains."
---

## Introduction

Sub categories are created via a dedicated API. Each sub category has a name and a unique code, as well as visual properties like **color**, **hovered_color**, and **background_color**.
Each sub category is associated with a parent main category.
Both **TrainSchedules** and **PacedTrains** can specify either a **main_category** or a user-defined **sub_category_code**.

### SubCategory model

```yml
name: "RER"
code: "RER"
main_category: "COMMUTER_TRAIN"
color: "#FF0000"
hovered_color: "#FFA500"
background_color: "#FFD700"
```

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

Only one of the two can be defined at a time, or both can be absent.

If a referenced sub category is deleted, the affected train schedules or paced trains will automatically fall back to the sub category’s associated **main_category**.

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
