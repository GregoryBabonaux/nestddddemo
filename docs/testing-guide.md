# Guide des Tests - DDD NestJS Project 🧪

## Pourquoi tester ? 🤔

Les tests sont essentiels dans notre architecture DDD pour plusieurs raisons :

1. **Garantir le comportement métier** : 
   - Vérifier que les règles métier sont respectées
   - S'assurer que les invariants du domaine sont maintenus
   - Valider les cas limites et les erreurs

2. **Faciliter les changements** :
   - Refactorer en confiance
   - Détecter les régressions rapidement
   - Documenter le comportement attendu

3. **Améliorer la conception** :
   - Identifier les couplages forts
   - Valider les abstractions
   - Garantir la séparation des responsabilités

## Quoi tester ? 📝

### 1. Entités du Domaine
```typescript
// game.entity.spec.ts
describe('Game Entity', () => {
  it('should not allow empty title', () => {
    expect(() => {
      new Game('', '', 'user-123');
    }).toThrow('Game title cannot be empty');
  });
});
```
- Validations
- Invariants
- Comportements métier

### 2. Services Applicatifs
```typescript
// game.service.spec.ts
describe('createGame', () => {
  it('should create a game successfully', async () => {
    const result = await service.createGame(mockCreateGameDto);
    expect(result.getTitle()).toBe(mockCreateGameDto.title);
  });
});
```
- Logique métier
- Orchestration
- Gestion des erreurs

### 3. Contrôleurs
```typescript
// game.controller.spec.ts
describe('getGame', () => {
  it('should return a game if it exists', async () => {
    const result = await controller.getGame('game-123');
    expect(result).toBeDefined();
  });
});
```
- Validation des entrées
- Mapping des réponses
- Gestion des erreurs HTTP

### 4. Repositories
```typescript
// game.repository.spec.ts
describe('findById', () => {
  it('should return a game if it exists', async () => {
    const result = await repository.findById('game-123');
    expect(result).toBeInstanceOf(Game);
  });
});
```
- Mapping entité/modèle
- Requêtes
- Gestion des erreurs de BDD

## Comment tester ? 🛠️

### 1. Structure des Tests

```typescript
describe('Composant', () => {
  // Configuration
  beforeEach(() => {
    // Setup
  });

  describe('Fonctionnalité', () => {
    it('devrait faire quelque chose', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. Bonnes Pratiques

#### Nommage des Tests
```typescript
// ✅ Bon
it('should throw error when title is empty', () => {});

// ❌ Mauvais
it('test title empty', () => {});
```

#### Isolation
```typescript
// ✅ Bon
beforeEach(() => {
  mockGameRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };
});

// ❌ Mauvais
const mockGameRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};
```

#### Assertions Claires
```typescript
// ✅ Bon
expect(result.getTitle()).toBe('Test Game');

// ❌ Mauvais
expect(result).toEqual(expect.any(Object));
```

### 3. Mocking

#### Dépendances
```typescript
const mockGameRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};

const module: TestingModule = await Test.createTestingModule({
  providers: [
    GameService,
    {
      provide: INJECTION_TOKENS.GAME_REPOSITORY,
      useValue: mockGameRepository,
    },
  ],
}).compile();
```

#### Retours
```typescript
mockGameRepository.findById.mockResolvedValue(new Game(
  'game-123',
  'Test Game',
  'user-123'
));
```

### 4. Tests Asynchrones

```typescript
// ✅ Bon
it('should create game', async () => {
  await expect(service.createGame(dto)).resolves.toBeDefined();
});

// ✅ Bon
it('should throw on error', async () => {
  await expect(service.createGame(invalidDto)).rejects.toThrow();
});
```

## Exécution des Tests 🏃‍♂️

### Commandes

```bash
# Tous les tests
npm test

# Un fichier spécifique
npm test game.service.spec.ts

# Avec couverture
npm test -- --coverage

# En mode watch
npm test -- --watch
```

### Configuration Jest

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

## Conseils 💡

1. **Test First** : Écrire les tests avant le code quand possible
2. **Isolation** : Chaque test doit être indépendant
3. **Lisibilité** : Les tests sont une documentation
4. **Maintenance** : Garder les tests simples et maintenables
5. **Couverture** : Viser une couverture significative, pas 100%

## Ressources 📚

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing DDD](https://enterprisecraftsmanship.com/posts/testing-in-ddd)
