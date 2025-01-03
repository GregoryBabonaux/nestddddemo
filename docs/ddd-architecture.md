# Architecture DDD

## Principes DDD

Le Domain-Driven Design (DDD) est une approche de développement logiciel qui :

1. Met l'accent sur le domaine métier et sa logique
2. Base la conception sur un modèle du domaine
3. Initie une collaboration créative entre experts techniques et experts métier

## Couches de l'architecture

### 1. Domain Layer

La couche domaine est le cœur de l'application. Elle contient :

- **Entités** : Objets avec une identité et un cycle de vie
  ```typescript
  export class User {
    constructor(
      private readonly id: string,
      private readonly email: string,
      // ...
    ) {}
  }
  ```

- **Value Objects** : Objets immuables sans identité
  ```typescript
  export class Email {
    constructor(private readonly value: string) {
      this.validate();
    }
  }
  ```

- **Agrégats** : Groupes d'entités et value objects
- **Domain Events** : Événements significatifs du domaine
- **Repository Interfaces** : Contrats pour la persistance

### 2. Application Layer

La couche application orchestre les cas d'utilisation :

- **Services applicatifs** : Orchestration des use cases
  ```typescript
  @Injectable()
  export class UserService {
    constructor(
      @Inject(INJECTION_TOKENS.USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
    ) {}
  }
  ```

- **DTOs** : Objets de transfert de données
  ```typescript
  export class CreateUserDto {
    @IsEmail()
    email: string;
  }
  ```

### 3. Infrastructure Layer

La couche infrastructure fournit les implémentations techniques :

- **Repositories** : Implémentation de la persistance
  ```typescript
  @Injectable()
  export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}
  }
  ```

- **Controllers** : Points d'entrée API
  ```typescript
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  }
  ```

## Bonnes pratiques

1. **Immutabilité**
   - Utiliser des getters au lieu de propriétés publiques
   - Créer de nouvelles instances plutôt que de modifier

2. **Encapsulation**
   - Cacher les détails d'implémentation
   - Exposer uniquement ce qui est nécessaire

3. **Single Responsibility**
   - Chaque classe a une seule responsabilité
   - Éviter les god objects

4. **Dependency Injection**
   - Utiliser l'injection de dépendances
   - Programmer vers des interfaces

## Patterns utilisés

1. **Repository Pattern**
   - Abstraction de la persistance
   - Interface dans le domaine, implémentation dans l'infrastructure

2. **Factory Pattern**
   - Création d'objets complexes
   - Encapsulation de la logique de création

3. **Dependency Injection**
   - Inversion de contrôle
   - Couplage faible

4. **DTO Pattern**
   - Transfert de données entre couches
   - Validation des données d'entrée

## Tests

1. **Tests unitaires**
   - Tester les entités et value objects
   - Mocker les dépendances

2. **Tests d'intégration**
   - Tester les repositories
   - Tester les services avec leurs dépendances

3. **Tests end-to-end**
   - Tester les endpoints API
   - Tester les scénarios complets
