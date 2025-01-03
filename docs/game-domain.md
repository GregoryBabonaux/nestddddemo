# Game Domain - Architecture Hexagonale

Ce module implémente une architecture hexagonale (ports & adapters) pour gérer les données de jeux provenant de différentes sources.

## Structure

```
src/game/
├── domain/
│   ├── game.ts                    # Entité de domaine Game
│   └── ports/
│       └── game.repository.ts     # Port pour l'accès aux données
├── infrastructure/
│   └── adapters/
│       ├── first-api.adapter.ts   # Adaptateur pour la première API
│       ├── second-api.adapter.ts  # Adaptateur pour la seconde API
│       └── federated-games.adapter.ts # Adaptateur fédérant les sources
```

## Architecture

L'architecture suit le pattern Ports & Adapters (Hexagonal) avec :

- **Domain** : Le cœur métier contenant l'entité `Game` et ses règles
- **Ports** : Les interfaces définissant les contrats pour accéder aux données
- **Adapters** : Les implémentations concrètes pour différentes sources de données

### Sources de Données

Le système fédère deux sources de données :

1. **Première API** :
   - Fournit : `title`, `description`
   - Adaptateur : `FirstApiAdapter`

2. **Seconde API** :
   - Fournit : `name`, `content`, `release_at`
   - Adaptateur : `SecondApiAdapter`

## Utilisation

```typescript
// Configuration des adaptateurs
const firstApi = new FirstApiAdapter('https://api1.example.com');
const secondApi = new SecondApiAdapter('https://api2.example.com');

// Création de l'adaptateur fédéré
const federatedGames = new FederatedGamesAdapter([firstApi, secondApi]);

// Récupération de tous les jeux
const allGames = await federatedGames.findAll();
```

## Extension

Pour ajouter une nouvelle source de données :

1. Créer un nouvel adaptateur implémentant `GameRepository`
2. L'ajouter à la liste des repositories dans `FederatedGamesAdapter`

```typescript
class NewApiAdapter implements GameRepository {
  async findAll(): Promise<Game[]> {
    // Implémentation spécifique
  }
}
```
