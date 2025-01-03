# DDD NestJS Learning Project

Ce projet est une implémentation de Domain-Driven Design (DDD) utilisant NestJS, Prisma et Docker. Il suit une architecture hexagonale avec une séparation claire des préoccupations.

## Table des matières

1. [Structure du projet](./docs/project-structure.md)
2. [Guide d'installation](./docs/installation.md)
3. [Guide du développeur](./docs/developer-guide.md)
4. [Guide pas à pas : Ajouter un nouveau domaine](./docs/new-domain-guide.md)
5. [Architecture DDD](./docs/ddd-architecture.md)
6. [API Documentation](./docs/api-documentation.md)
7. [Domain Game](./docs/game-domain.md)

## Quick Start

1. Cloner le projet
```bash
git clone [repository-url]
cd dddnestlearning
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'environnement
```bash
cp .env.example .env
```

4. Démarrer la base de données et l'application
```bash
docker-compose up
```

5. Accéder à la documentation Swagger
```
http://localhost:3000/api
```

## Technologies utilisées

- NestJS - Framework Node.js
- Prisma - ORM
- PostgreSQL - Base de données
- Docker - Conteneurisation
- Swagger - Documentation API

## Scripts utilitaires

### Création d'un nouveau domaine

Le projet inclut un script utilitaire pour générer rapidement un nouveau domaine DDD :

```bash
# Windows
createNewDomain --name mondomaine
```

Le script crée automatiquement toute la structure DDD nécessaire dans `src/mondomaine/` :
- Application (DTOs, Services)
- Domain (Entities, Repository Interfaces)
- Infrastructure (Controllers, Repository Implementations)

Pour plus de détails sur l'utilisation du script et la configuration manuelle nécessaire, consultez le [Guide d'ajout d'un nouveau domaine](./docs/new-domain-guide.md).
