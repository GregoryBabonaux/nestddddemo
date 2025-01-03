# Structure du Projet

## Vue d'ensemble

```
src/
├── game/                  # Module Game
│   ├── application/      # Cas d'utilisation et services
│   │   ├── dtos/
│   │   └── services/
│   ├── domain/          # Entités et interfaces
│   │   ├── entities/
│   │   └── repositories/
│   └── infrastructure/  # Implémentations
│       ├── controllers/
│       └── repositories/
├── user/                 # Module User (même structure)
└── shared/              # Code partagé
    ├── constants/
    ├── interfaces/
    └── infrastructure/
        └── prisma/
```

## Description des couches

### Domain Layer

La couche domaine contient :
- Entités : Objets de domaine avec logique métier
- Interfaces des repositories : Contrats pour la persistance
- Value Objects : Objets immuables représentant des concepts métier
- Agrégats : Groupes d'entités traitées comme une unité

### Application Layer

La couche application contient :
- DTOs : Objets de transfert de données
- Services : Orchestration des cas d'utilisation
- Interfaces des services : Contrats pour les services
- Validations : Règles de validation métier

### Infrastructure Layer

La couche infrastructure contient :
- Controllers : Points d'entrée API REST
- Repositories : Implémentations de la persistance
- Configurations : Setup technique
- Adaptateurs : Intégrations externes

### Shared Layer

La couche partagée contient :
- Constants : Valeurs constantes partagées
- Interfaces : Interfaces communes
- Utils : Fonctions utilitaires
- Infrastructure partagée : Services techniques communs
