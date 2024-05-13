---
title: "Rolling stock collections"
linkTitle: "Rolling stock collections"
weight: 90
---

## Context and requirements

As of the writting of this proposal, rolling stocks:
- are identified using a globally unique name
- cannot be made private

With the upcoming authorization system, this setup bring a couple of new issues:
- timetables can have a lot of different rolling stocks, which would need individual permission checks if the current setup were to be preserved
- users probably do not want to have to individually give access to each rolling stock in a large collection
- looking up rolling stocks becomes a per-user job, as not all users are authorized to know a given rolling stock exists

These issues are deemed too damaging to implement rolling stock authorization as is.

## Proposal

A concept of rolling stock collection would be introduced:
- each rolling stock must belong to exactly one collection
- rolling stocks do not have individual permissions; permissions are managed at the collection level
- when creating a scenario, rolling stock collections need to be added

Rolling stock collections have:
- a name
- a description


```sql
create table rolling_stock_collection(
  id  bigserial generated always as identity primary key,
  name text not null,
  created_by  bigint references authn_user on delete set null,
  created_at  timestamp not null default CURRENT_TIMESTAMP,
);

alter table rolling_stock
add column collection bigserial references rolling_stock_collection on delete cascade not null;

-- speed up cascade
create index on rolling_stock_collection(created_by);
create index on rolling_stock(collection);
```


## Implementation plan

### Phase 1: backend only

- introduce the new data model
- migrate existing rolling stocks into a default collection
- migrate existing scenarios to add the rolling stock collection
- until the rolling stock editor is updated, add all rolling stocks to the default collection

### Phase 2: full migration

- update STDCM to allow choosing rolling stock collections
- update the scenario creation form to allow linking with rolling stock collections
- update the rolling stock editor to allow creating collections
- update the rolling stock editor so that rolling stocks must be created within a collection
- update editoast to require rolling stocks to be created within a collection
