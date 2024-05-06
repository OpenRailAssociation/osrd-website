---
title: "Editoast internal authorization API"
linkTitle: "Editoast internal authorization API"
weight: 10
---

{{% pageinfo color="warn" %}}
This document is an annex to the [main authorization design document](..)
{{% /pageinfo %}}

{{% pageinfo color="info" %}}
This design document is not intended to describe the exact editoast authorization API.
The actual implementation may slightly differ. If major limitations were uncovered, please
update this document.
{{% /pageinfo %}}

## Context and requirements

The following invariants were deemed worth validating:

- (high priority) role and privilege checks were performed
- (low priority) privilege checks are performed before changes are made / data is returned
- (low priority) access patterns match privilege checks

Other design criterias have an impact:

- (high priority) misuse potential
- (high priority) usage complexity and developer experience
- (medium priority) ease of migration
- (low priority) static checks are prefered

## Data model

### Builtin roles

First, we define an enum for all our builtin roles:

```rust
#[derive(Roles, EnumSetType, Copy)]
enum BuiltinRole {
    #[role(tag = "infra:read")]
    InfraRead,
    #[role(tag = "infra:write", implies = [InfraRead])]
    InfraWrite,
    #[role(tag = "rolling-stock:read")]
    RollingStockRead,
    #[role(tag = "rolling-stock:write", implies = [RollingStockRead])]
    RollingStockWrite,
    #[role(tag = "timetable:read")]
    TimetableRead,
    #[role(tag = "timetable:write", implies = [TimetableRead])]
    TimetableWrite,
    #[role(tag = "operational-studies:read", implies = [TimetableRead, InfraRead, RollingStockRead])]
    OperationalStudiesRead,
    #[role(tag = "operational-studies:write", implies = [OperationalStudiesRead, TimetableWrite])]
    OperationalStudiesWrite,
}
```

which could expand to:

```rust
#[derive(EnumSetType, Copy)]
enum BuiltinRole {
    InfraRead,
    InfraWrite,
    RollingStockRead,
    RollingStockWrite,
    TimetableRead,
    TimetableWrite,
    OperationalStudiesRead,
    OperationalStudiesWrite,
}

const ROLES: phf::Map<&'static str, BuiltinRole> = phf::phf_map! {
    "infra:read" => Self::InfraRead,
    "infra:write" => Self::InfraWrite,
    "rolling-stock:read" => Self::RollingStockRead,
    "rolling-stock:write" => Self::RollingStockWrite,
    "timetable:read" => Self::TimetableRead,
    "timetable:write" => Self::TimetableWrite,
    "operational-studies:read" => Self::OperationalStudiesRead,
    "operational-studies:write" => Self::OperationalStudiesWrite,
};

impl BuiltinRole {
    fn parse_tag(tag: &str) -> Option<BuiltinRole> {
        ROLES.get(tag)
    }

    fn tag(&self) -> &'static str {
        match self {
            Self::InfraRead => "infra:read",
            Self::InfraWrite => "infra:write",
            Self::RollingStockRead => "rolling-stock:read",
            Self::RollingStockWrite => "rolling-stock:write",
            Self::TimetableRead => "timetable:read",
            Self::TimetableWrite => "timetable:write",
            Self::OperationalStudiesRead => "operational-studies:read",
            Self::OperationalStudiesWrite => "operational-studies:write",
        }
    }

    fn implies(&self) -> &[Self] {
        match self {
            Self::InfraRead => &[Self::InfraRead],
            Self::InfraWrite => &[Self::InfraRead, Self::InfraWrite],
            Self::RollingStockRead => &[Self::RollingStockRead],
            Self::RollingStockWrite => &[Self::RollingStockRead, Self::RollingStockWrite],
            Self::TimetableRead => &[Self::TimetableRead],
            Self::TimetableWrite => &[Self::TimetableRead, Self::TimetableWrite],
            Self::OperationalStudiesRead => &[Self::TimetableRead, Self::InfraRead, Self::RollingStockRead],
            Self::OperationalStudiesWrite => &[Self::OperationalStudiesRead, Self::TimetableWrite],
        }
    }
}
```

### Application roles

Application roles are loaded from a yaml file at application startup:

```yaml
application_roles:
  ops:
    name: "DevOps"
    description: "Software engineers in charge of operating and maintaining the app"
    implies: [admin]
  stdcm-customer:
    name: "STDCM customer"
    implies: [stdcm]
  operational-studies-customer:
    name: "Operational studies customer"
    implies: [operational-studies:read]
  operational-studies-analyse:
    name: "Operational studies analyse"
    implies: [operational-studies:write]
```

Once loaded into editoast, app roles are resolved to a set of user roles:


```rust
type UserRoles = EnumSet<BuiltinRole>;

struct AppRoleResolver(HashMap<String, UserRoles>);

/// The API does not allow querying app roles, as it should have no impact on authorization:
/// only the final resolved set of builtin roles matters.
impl AppRoleResolver {
    fn load_from_config(&path: Path) -> Result<Self, E>;
    fn resolve(&self, app_role_tag: &str) -> Result<UserRoles, E>;
}
```

### Resources and grants


TODO: decide where to process implicit grants: database or editoast?

```rust
enum ResourceType {
    Group,
    Project,
    Study,
    Scenario,
    Timetable,
    Infra,
    RollingStockCollection,
}

struct Grant {
    grant_id: u64,
    subject: SubjectId,
    privlvl: GrantPrivLvl,
    granted_by: UserId,
    granted_at: Timestamp,
}

async fn all_grants(conn, resource_type: ResourceType, resource_id: u64) -> Vec<Grant>;
async fn applicable_grants(conn, resource_type: ResourceType, resource_id: u64, subject_ids: Vec<SubjectId>) -> Vec<Grant>;
async fn revoke_grant(conn, resource_type: ResourceType, grant_id: u64);
async fn update_grant(conn, resource_type: ResourceType, grant_id: u64, privlvl: GrantPrivLvl);
```

## Low level authorization API

```rust
struct PrivCheck {
    resource_type: ResourceType,
    resource_id: u64,
    minimum_privlvl: EffectivePrivLvl,
}

/// The authorizer is injected into each request by a middleware.
/// The middleware finds the user ID associated with the request.
/// At the end of each request, it ensures roles and privileges were checked.
struct Authorizer {
    user_id: u64,
    checked_roles: Option<UserRoles>,
    checked_privs: Option<Vec<PrivCheck>>,
};

impl FromRequest for Authorizer {}

impl Authorizer {
    async fn check_roles(
        conn: &mut DatabaseConnection,
        required_roles: &[BuiltinRole],
    ) -> Result<bool, Error>;

    async fn check_privs(
        conn: &mut DatabaseConnection,
        required_privs: &[PrivCheck],
    ) -> Result<bool, Error>;
}
```

This API is then used as follows:

```rust
#[post("/project/{project_id}/study/{study_id}/scenario")]
async fn create_scenario(
    path: Path<(i64, i64)>,
    authz: Authorizer,
    db_pool: web::Data<DatabasePool>,
    Json(form): Json<ScenarioCreateForm>,
) -> Result<Response, Error> {
    let conn, db_pool.get().await;
    let (project_id, study_id) = path.into_inner();

    // validate that study.scenario == scenario

    authz.check_roles(&mut conn, &[BuiltinRoles::OperationalStudiesWrite]).await?;
    authz.check_privs(&mut conn, &[(Study, study_id, Creator).into()]).await?;

    // create the object
    // ...

    Ok(...)
}
```


## High level authorization API

### 🤔 Proposal: fully dynamic checks

This proposal suggests dynamically enforcing all authorization invariants:

- _role and privilege checks were performed_: The authorizer records all checks, and panics / logs an error if no check is made
- _privilege checks are performed before changes are made / data is returned_: checked database accesses
  (the default) cannot be made before commiting authorization checks. No more authorization check can be made after commiting.
- _access patterns match privilege checks_: Check database access functions ensure a prior check was
  made using the Authorizer's check log.


Each database access method thus gets two variants:

- a checked variant (the default), which takes the Authorizer as a parameter. This variants panics if:

  - a resource is accessed before authorization checks are commited
  - a resource is accessed without a prior authorizer check.

- an unchecked variant. its use should be limited to:

  - fetching data for authorization checks
  - updating modification dates


```rust
#[post("/project/{project_id}/study/{study_id}/scenario")]
async fn create_scenario(
    path: Path<(i64, i64)>,
    authz: Authorizer,
    db_pool: web::Data<DatabasePool>,
    Json(form): Json<ScenarioCreateForm>,
) -> Result<Response, Error> {
    let conn, db_pool.get().await;
    let (project_id, study_id) = path.into_inner();

    // Check if the project and the study exist
    let (mut project, mut study) =
        check_project_study_conn(&mut conn, project_id, study_id).await?;

    authz.check_roles(&mut conn, &[BuiltinRoles::OperationalStudiesWrite])?;
    authz.check_privs(&mut conn, &[(Study, study_id, Creator).into()])?;

    // all checks done, checked database accesses allowed
    authz.commit();

    // ...

    // create the scenario
    let scenario: Scenario = data.into_scenario(study_id, timetable_id);
    let scenario = scenario.create(db_pool.clone(), &authz).await?;

    // Update study last_modification field
    study.update_last_modified(conn).await?;

    // Update project last_modification field
    project.update_last_modified(conn).await?;

    // ...

    Ok(...)
}
```

### Bonus proposal: require roles using macros

TODO: check if this is worth keeping


Then, we annotate each endpoint that require role restrictions with `requires_roles`:

```rust
#[post("/scenario")]
#[requires_roles(BuiltinRoles::OperationalStudiesWrite)]
async fn create_scenario(
    user: web::Header<GwUserId>,
    db_pool: web::Data<DatabasePool>
) -> Result<Response, Error> {
    todo!()
}
```

which may expand to something similar to:

```rust
async fn create_scenario(
    user: web::Header<GwUserId>,
    db_pool: web::Data<DatabasePool>
) -> Result<Response, Error> {
    {
        let conn = &mut db_pool.get().await?;
        let required_roles = [BuiltinRoles::OperationalStudiesWrite];
        if !editoast_models::check_roles(conn, &user_id, &required_roles).await? {
            return Err(403);
        }
    }
    async move {
        todo!()
    }.await
}
```
### 🤔 Proposal: Static access control

{{% pageinfo color="info" %}}
This proposal aims at improving the `Authorizer` descibed above by building on it a safety layer that encodes granted permissions into the type system.

This way, if access patterns do not match the privilege checks performed beforehand, the program will fail to compile and precisely pinpoint the privilege override as a type error.
{{% /pageinfo %}}

To summarize, the `Authorizer` allows us to:

1. Pre-fetch the user of the request and its characteristics as a middleware
1. Check their roles
1. Maintain a log of authorization requests on specific ressources, and check if they hold
1. Guarantees that no authorization will be granted passed a certain point (`commit` function)
1. At the end of an endpoint, checks that permissions were granted or `panic!`s otherwise

While all these checks are performed at runtime, those can be tested rather trivially in unit tests.

However, the `Authorizer` cannot check that the endpoints actually respect the permission level they asked for when they access the DB. For example, an endpoint might ask for `Read` privileges on a `Timetable`, only to delete it afterwards. This is trivial to check if the privilege override happens in the same function, but it can be much more vicious if that happens conditionally, in another function, deep down the call stack. For the same reasons, refactoring code subject to authorizations becomes much more risky and error prone.

Hence, for both development and review experience, to ease writing and refactoring authorizing code, to be confident our system works, and for general peace of mind, we need a way to ensure that an endpoint won't go beyond the privilege level it required for all of its code paths.

We can do that either statically or dynamically.

#### Dynamic access pattern checks

Let's say we keep the `Authorizer` as the high-level API for authorization.
It holds a log of grants. Therefore, any DB operation that needs to be authorized must, in addition to the `conn`, take an `Arc<Authorizer>` parameter and let the operation check that it's indeed authorized. For example, every `retrieve(conn, authorizer, id)` operation would ask the authorizer the permission before querying the DB.

This approach works and has the benefit of being easy to understand, but does not provide any guarantee that the access paterns match the granted authorizations and that privilege override cannot happen.
A way to ensure that would be to thoroughly test each endpoint and ensure that the DB accesses `panic` in expected situations. Doing so manually is extremely tedious and fragile in the long run, so let's focus on automated tests.
To make sure that, at any moment, each endpoint doesn't override its privileges, we'd need a test for each releveant privilege level and for each code path accessing ressources. Admittedly this would be great, but:

- it **heavily depends on test coverage** (which we don't have) to make sure no code path is left out, i.e. that no test is missing
- it's unrealistic given the current state of things and how fast editoast changes
- tests would be extremely repetitive, and mistakes will happen
- the test suite of an endpoint now not only depends on what it should do, but also on **how** it should do it: i.e. to know how to test your endpoint, you need to know precisely what DB operations will be performed, under what conditions, on all code paths, and replicate that
- when refactoring code subject to authorization that's shared across several endpoints, the tests of each of these endpoints would need to be examined to ensure no check goes missing
- unless we postpone the creation of these tests and accept a lower level of confidence in our system, even temporarily(TM), the authz migration would be slowed down significantly

Or we could just accept the risk.

Or we could statically ensure that no endpoint override its requested privileges, using the typesystem, and be sure that such issues can (almost) never arise.

#### Static checks

The idea is to provide an high-level API for authorization, on top of the `Authorizer`. It encodes granted privileges into the typesystem. For example,
for a request `GET /timetable/42`, the endpoint will ask from the `Authorizer` an `Authz<Timetable, Read>` object:

```rust
let timetable_authz: Authz<Timetable, Read> = authorizer.authorize(&[42])?;
```

The authorizer does two things here:

1. Checks that the privilege level of the user allows them to `Read` on the timetable ID#42.
1. Builds an `Authz` object that stores the ID#42 for later checks, which encodes in the type system that we have a `Read` authorization on _some_ `Timetable` ressources.

Then, after we `authorizer.commit();`, we can use the `Authz` to effectively request the timetable:

```rust
let timetable: Timetable = timetable_authz.retrieve(conn, 42)?;
```

The `Authz` checks that the ID#42 is indeed authorized before forwarding the call the `modelv2::Retrieve::retrieve` function that performs the query.
However, if by mistake we wrote:

```rust
let timetable = timetable_authz.delete(conn, 42)?;
```

we'd get a compilation error such as `Trait AuthorizedDelete is not implemented for Authz<Timetable, Read>`, effectively preventing a privilege override statically.

On a more realistic example:

```rust
impl Scenario {
    fn remove(
        self,
        conn: &mut DatabaseConnection,
        scenario_authz: Authz<Self, Delete>,
        study_authz: Authz<Study, Update>,
    ) -> Result<(), Error> {
        // open transaction
        scenario_authz.delete(conn, self.id)?;
        let cs = Study::changeset().last_update(Datetime::now());
        study_authz.update(conn, self.study_id, cs)?;
        Ok(())
    }
}
```

This approach brings several advantages:

- **correctness**: the compiler will prevent any privilege override for us
- **readability**: if a function requires some form of authorization, it will show in its prototype
- **ease of writing**: we can't write DB operations that ultimately wouldn't be authorized, avoiding a potential full rewrite once we notice the problem (and linting is on our side to show problems early)
- **more declarative**: if you want to read an object, you ask for a `Read` permission, the system is then responsible for checking the privilege level and map that to a set of allowed permissions. This way we abstract a little over the hierarchy of privileges a ressource can have.
- **ease of refactoring**: thanks rustc ;)
- **flexibility**: since the `Authz` has a reference to the `Authorizer`, the API mixes well with more dynamic contexts (should we need that in the future)
- **migration**
  - shouldn't be too complex or costly since the `Authz` wraps the `ModelV2` traits
  - _will require changes in the same areas that would be impacted by a dynamic checker_, no more, no less (even in the dynamic context mentioned above we still need to pass the `Arc<Authorizer>` down the call stack)
- **contamination**: admittedly, this API is slightly more contaminating than just passing an `Arc<Authorizer>` everywhere. However, this issue is mitigated on several fronts:
  - most endpoints in editoast either access the DB in the endpoint function itself, or in at most one or two function calls deep. So the contamination likely won't spread far and the migration shouldn't take much more time.
  - if we notice that a DB call deep down the call stack requires an  `Authz<T, _>` that we need to forward through many calls, it's probably pathological of a bad architecture


---

The following sections explore how to use this API:

- to define authorized ressources
- implement the effective privilege level logic
- to deal with complex ressources (here `Study`) which need custom authorization rules and that are not atomic (the budgets follow different rules than the rest of the metadata)
- to implement an endpoint that require different permissions (`create_scenario`)

##### Actions

We define all actions our `Authz` is able to expose at both type-level and at runtime (classic CRUD + Append for exploitation studies).

```rust
mod action {
    struct Create;
    struct Read;
    struct Update;
    struct Delete;
    struct Append;

    enum Cruda {
        Create,
        Read,
        Update,
        Delete,
        Append,
    }

    trait AuthorizedAction {
        fn as_cruda() -> Cruda;
    }

    impl AuthorizedAction for Create;
    impl AuthorizedAction for Read;
    impl AuthorizedAction for Update;
    impl AuthorizedAction for Delete;
    impl AuthorizedAction for Append;
}
```

The motivation behind this is that at usage, we don't usually care about the privilege of a user over a ressource. We only care, if we're about to read a ressource, whether the user has a privilege level **high enough** to do so.

The proposed paradigm here is to ask the permission to to an **action over a ressource**, and let the ressource definition module decide (using its own effective privilege hierarchy) whether the action is authorized or not.

##### Standard and custom effective privileges

We need to define the effective privilege level for each ressource. For most
ressources, a classic `Reader < Writer < Owner` is enough. So we expose that by default, leaving the choice to each ressource to provide their own.

We also define an enum providing the origin of a privilege, which is a useful
information for permission sharing.

```rust
// built-in the authorization system

#[derive(PartialOrd, PartialEq)]
enum StandardPrivilegeLevel {
    Read,
    Write,
    Own,
}

enum StandardPrivilegeLevelOrigin {
    /// It's an explicit privilege
    User,
    /// The implicit privilege comes from a group the user belongs to
    Group,
    /// The implicit privilege is granted publicly (authz_grant_xyz.subject IS NULL)
    Public,
}

trait PrivilegeLevel: PartialOrd + PartialEq {
    type Origin;
}

impl PrivilegeLevel for StandardPrivilegeLevel {
    type Origin = StandardPrivilegeLevelOrigin;
}
```

##### Grant definition

Then we need to associate to each grant in DB its effective privilege level and origin.

```rust
// struct AuthzGrantInfra is a struct that models the table authz_grant_infra

impl EffectiveGrant for AuthzGrantInfra {
    type EffectivePrivilegeLevel = StandardPrivilegeLevel;

    async fn fetch_grants(
        conn: &mut DbConnection,
        subject: &Subject,
        keys: &[i64],
    ) -> GrantMap<Self::EffectivePrivilegeLevel>? {
        crate::tables::authz_grants_infra.filter(...
    }
}
```

where `GrantMap<PrivilegeLevel>` is an internal representation of a collection of grants (implicit and explicit) with some privilege level hierarchy (custom or not).

##### Ressource definition

Each ressource is then associated to a model and a grant type. We also declare which actions are allowed based on how we want the model to be used given the effective privilege of the ressource in DB.

The `RessourceType` is necessary for the dynamic context of the underlying `Authorizer`.

```rust
impl Ressource for Infra {
    type Grant = AuthzGrantInfra;
    const TYPE: RessourceType = RessourceType::Infra;

    /// Returns None is the action is prohibited
    fn minimum_privilege_required(action: Cruda) -> Option<Self::Grant::EffectivePrivilegeLevel> {
        use Cruda::*;
        use StandardPrivilegeLevel as lvl;
        Some(match action {
            Read => lvl::Read,
            Create | Update | Append => lvl::Write,
            Delete => lvl::Own,
        })
    }
}
```

And that's it!

The rest of the mechanics are located within the authorization system.

##### A more involved example: Studies

```rust
//////// Privilege levels

enum StudyPrivilegeLevel {
    ReadMetadata, // a scenario of the study has been shared
    Read,
    Append, // can only create scenarios
    Write,
    Own,
}

enum StudyPrivilegeLevelOrigin {
    User,
    Group,
    Project, // the implicit privilege comes from the user's grants on the study's project
    Public,
}

impl PrivilegeLevel for StudyPrivilegeLevel {
    type Origin = StudyPrivilegeLevelOrigin;
}

///////// Effective grant retrieval

impl EffectiveGrant for AuthzGrantStudy {
    type EffectivePrivilegeLevel = StudyrivilegeLevel;

    async fn fetch_grants(
        conn: &mut DbConnection,
        subject: &Subject,
        keys: &[i64],
    ) -> GrantMap<Self::EffectivePrivilegeLevel>? {
        // We implement here the logic of implicit privileges where an owner
        // of a project is also owner of all its studies
        crate::tables::authz_grants_study
            .filter(...)
            .inner_join(crate::tables::study.on(...))
            .inner_join(crate::tables::project.on(...))
            .inner_join(crate::tables::authz_grants_project.on(...))
    }
}


//////// Authorized ressources

/// Budgets of the study (can be read and updated by owners)
struct StudyBudgets { ... }

impl Ressource for StudyBudgets {
    type Grant = AuthzGrantStudy;
    const TYPE: RessourceType = RessourceType::Study;

    fn minimum_privilege_required(action: Cruda) -> Option<StudyPrivilegeLevel> {
        use Cruda::*;
        use StudyPrivilegeLevel as lvl;
        Some(match action {
            Read | Update => lvl::Own,
            _ => return None,
        })
    }
}

/// Non-sensitive metadata available to users with privilege level MinimalMetadata (can only be read)
struct StudyMetadata { ... }

impl Ressource for StudyMetadata {
    type Grant = AuthzGrantStudy;
    const TYPE: RessourceType = RessourceType::Study;

    fn minimum_privilege_required(action: Cruda) -> Option<StudyPrivilegeLevel> {
        use Cruda::*;
        use StudyPrivilegeLevel as lvl;
        Some(match action {
            Read => lvl::ReadMetadata,
            _ => return None,
        })
    }
}

/// A full study (can be created, read, updated, appended and deleted)
struct Study { ... }

impl Ressource for Study {
    type Grant = AuthzGrantStudy;
    const TYPE: RessourceType = RessourceType::Study;

    fn minimum_privilege_required(action: Cruda) -> Option<StudyPrivilegeLevel> {
        use Cruda::*;
        use StudyPrivilegeLevel as lvl;
        Some(match action {
            Read => lvl::Read,
            Append => lvl::Append,
            Create => lvl::Create,
            Update => lvl::Write,
            Delete => lvl::Own,
        })
    }
}
```

##### Concrete endpoint definition

```rust
#[post("/scenario")]
async fn create_scenario(
    authorizer: Arc<Authorizer>,
    conn: DatabaseConnection,
    db_pool: web::Data<DatabasePool>,
    Json(form): Json<ScenarioCreateForm>,
    path: Path<(i64, i64)>,
    authz: Authorizer,
) -> Result<Response, Error> {
    let conn, db_pool.get().await;
    let (project_id, study_id) = path.into_inner();

    let ScenarioCreateForm { infra_id, timetable_id, .. } = &form;

    authorizer.authorize_roles(&mut conn, &[BuiltinRoles::OperationalStudiesWrite]).await?;
    let _ = authorizer.authorize::<Timetable, Read>(&mut conn, &[timetable_id]).await?;
    let _ = authorizer.authorize::<Infra, Read>(&mut conn, &[infra_id]).await?;
    let study_authz: Authz<Study, Append> = authorizer.authorize(&mut conn, &[study_id]).await?;
    authorizer.commit();

    let response = conn.transaction(move |conn| async {
        let scenario: Scenario = study_authz.append(&mut conn, form.into()).await?;
        scenario.into_response()
    }).await?;
    Ok(Json(response))
}
```
