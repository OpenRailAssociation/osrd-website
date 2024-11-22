---
title: "Déployer OSRD"
linkTitle: "Déployer OSRD"
weight: 10
description: Apprenez à déployer OSRD dans différents environnements
---

Tout d'abord, nous recommandons de se familiariser sur [l'architecture des conteneurs d'OSRD]({{< ref "/docs/explanation/containers-architecture" >}}).

Nous allons couvrir comment déployer OSRD dans les configurations suivantes :

- [Utiliser docker compose]({{< ref "/docs/guides/deploy/docker-compose" >}}) sur un seul nœud.
- [Utiliser helm]({{< ref "/docs/guides/deploy/docker-compose" >}}) sur un cluster kubernetes.

Il est également possible de déployer manuellement chaque service d'OSRD sur un système, mais nous ne couvrirons pas ce sujet dans ce guide.


{{% alert title="NB" color="warning" %}}
Pour que l'outil STDCM fonctionne, il faut configurer l'environnement de recherche STDCM, une configuration stockée en base de données.
Consultez la [page dédiée]({{< ref "/docs/guides/deploy/stdcm-search-env" >}}) pour plus d'informations.
{{% /alert %}}
