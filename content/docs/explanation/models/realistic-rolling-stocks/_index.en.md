---
title: "Rolling stock categories"
linkTitle: "Rolling stock categories"
weight: 20
description: "Defines rolling stock categories"
---

Categories are groupings of rolling stock, either by their characteristics, performance or by the nature of the services for which they have been designed or are used.

The same rolling stock can be used for different types of operations and services. This versatility is reflected in the following attributes:
- `primary_category` (required) indicates the main use of a rolling stock
- `other_categories` (optional) indicates other possible uses of a rolling stock

The primary category of a rolling stock enables several features, such as filtering, differentiated display on charts or network graphic views, and, more broadly, the aggregation of rolling stocks.

#### Categories of rolling stocks

The different default rolling stock categories are as follows:

- `High-speed train` (see [High-speed train](https://en.wikipedia.org/wiki/High-speed_rail))
- `Intercity train` (see [Intercity train](https://en.wikipedia.org/wiki/Inter-city_rail))
- `Regional train` (see [Regional train](https://en.wikipedia.org/wiki/Regional_rail))
- `Commuter train` (see [Commuter train](https://en.wikipedia.org/wiki/Commuter_rail))
- `Freight train` (see [Freight train](https://en.wikipedia.org/wiki/Rail_freight_transport))
- `Fast freight train` (same as Freight train, but with a different composition code, `ME140` instead of `MA100` for example)
- `Night train` (see [Night train](https://en.wikipedia.org/wiki/Sleeping_car))
- `Tram-train` (see [Tram-train](https://en.wikipedia.org/wiki/Tram-train))
- `Touristic train` (see [Touristic train](https://en.wikipedia.org/wiki/Heritage_railway))
- `Work train` (see [Work train](https://en.wikipedia.org/wiki/Work_train))

It is also planned that, in the future, a user will be able to create new rolling stock categories directly.

### Realistic open data rolling stocks

To make the application more accessible to users outside the railway industry, such as external contributors and research laboratories, and to prepare for the release of the public playground version of OSRD, several rolling stock created with mock data are available to all users.

These rolling stocks are designed to cover most simulation scenarios that users may encounter.

These rolling stocks are not actual rolling stocks, due to confidentiality reasons, but they have been created based on real data to ensure a high level of realism.

The rolling stocks are provided as [JSON files](https://github.com/OpenRailAssociation/osrd/tree/dev/tests/data/rolling_stocks). We created one representative rolling stock for each category listed above.

The characteristics of these rolling stocks have been calculated based on the average values of real rolling stocks within each category. Additionally, most of these models are designed to be compatible across various networks: they are primarily bi-mode (supporting multiple electric voltage and current supply types), which is not always the case for real-world rolling stocks.

An example of rolling stock, a **high-speed train**, is represented below, from the rolling stock editor of the application:

![Rolling stock](high-speed-rolling-stock.en.png)

#### Open data

Since these rolling stocks are fictional (yet realistic), they can be freely used in projects beyond OSRD.

To access and use them in the application:

- **From the open-source playground:** The rolling stocks are available by default.

- **From a locally launched application:** Use the corresponding command in the [README](https://github.com/OpenRailAssociation/osrd/blob/dev/README.md) to import the test rolling stocks in your database.
