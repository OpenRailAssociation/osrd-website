---
title: "Docker Compose"
linkTitle: "Docker Compose"
weight: 10
description: Utiliser docker compose pour un déploiement sur un seul nœud
---

Le projet OSRD inclut un fichier docker-compose.yml conçu pour faciliter le déploiement d'un environnement OSRD pleinement fonctionnel. Initialement destiné à des fins de développement, ce Docker Compose peut également être adapté pour des déploiements rapides sur un seul nœud.

## Prérequis

Avant de procéder au déploiement, assurez-vous que vous avez installé :

- Docker
- Docker Compose

## Vue d'ensemble de la configuration

Le fichier `docker-compose.yml` définit les services suivants :

1. **PostgreSQL** : Une base de données PostgreSQL avec l'extension PostGIS.
2. **Redis** : Un serveur Redis pour le cache.
3. **Core** : Le service central OSRD.
4. **Front** : Le service front-end pour OSRD.
5. **Editoast** : Un service OSRD responsable de diverses fonctions d'édition.
6. **Gateway** : Sert de passerelle pour les services OSRD.
7. **Wait-Healthy** : Un service utilitaire pour s'assurer que tous les services sont sains avant de procéder.

Chaque service est configuré avec des contrôles de santé, des montages de volumes et les variables d'environnement nécessaires.

## Étapes du déploiement

1. **Cloner le dépôt** : Tout d'abord, clonez le dépôt OSRD sur votre machine locale.
2. **Variables d'environnement** (facultatif) : Définissez les variables d'environnement nécessaires si vous devez ajuster certaines configurations.
3. **Construire et exécuter** : Naviguez vers le répertoire contenant `docker-compose.yml` et exécutez :

```bash
docker-compose up --build
```

Cette commande construit les images et démarre les services définis dans le fichier Docker Compose.

## Accès aux services

Bien que tous les services HTTP soient utilisés via la passerelle (`http://localhost:4000`), vous pouvez accéder directement à chaque service en utilisant leurs ports exposés :

- **PostgreSQL** : Accessible sur `localhost:5432`.
- **Redis** : Accessible sur `localhost:6379`.
- **Service Core** : Accessible sur `localhost:8080`.
- **Front-End** : Accessible sur `localhost:3000`.
- **Editoast** : Accessible sur `localhost:8090`.

## Notes et considérations

- Cette configuration est conçue pour le développement et les déploiements rapides. Pour les environnements de production, des considérations supplémentaires en matière de sécurité, de scalabilité et de fiabilité doivent être abordées.
- Assurez-vous que le `POSTGRES_PASSWORD` et d'autres identifiants sensibles sont gérés en toute sécurité, en particulier dans les déploiements de production.

