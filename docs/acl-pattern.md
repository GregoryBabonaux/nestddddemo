# Anti-Corruption Layer (ACL) Pattern 🛡️

## Concept

L'ACL est un pattern qui protège notre domaine métier des détails techniques externes. Dans notre cas, il sépare :
- Le modèle du domaine (`Game` entity)
- Le modèle de persistence (Prisma model)

## Les Méthodes de Mapping

### 1. toDomain 🔄

```typescript
private toDomain(prismaGame: PrismaGame): Game {
  return new Game(
    prismaGame.id,
    prismaGame.title,
    prismaGame.description,
    prismaGame.userId,
    prismaGame.createdAt,
    prismaGame.updatedAt,
  );
}
```

**Rôle** :
- Convertit un modèle Prisma en entité du domaine
- Garantit que les données respectent les règles métier
- Isole le domaine des détails de la base de données

**Utilisation** :
```typescript
// Dans le repository
async findById(id: string): Promise<Game> {
  const prismaGame = await this.prisma.game.findUnique({ where: { id } });
  return prismaGame ? this.toDomain(prismaGame) : null;
}
```

### 2. fromDomain 🔄

```typescript
private fromDomain(game: Game): Prisma.GameCreateInput {
  return {
    title: game.getTitle(),
    description: game.getDescription(),
    userId: game.getUserId(),
  };
}
```

**Rôle** :
- Convertit une entité du domaine en modèle Prisma
- Prépare les données pour la persistence
- Évite la pollution du domaine par les détails de Prisma

**Utilisation** :
```typescript
// Dans le repository
async save(game: Game): Promise<Game> {
  const data = this.fromDomain(game);
  const prismaGame = await this.prisma.game.create({ data });
  return this.toDomain(prismaGame);
}
```

## Avantages 🎯

1. **Isolation** :
   - Le domaine ne connaît pas Prisma
   - Les changements de BDD n'affectent que le repository

2. **Validation** :
   - Les données sont validées à l'entrée
   - Les règles métier sont respectées

3. **Flexibilité** :
   - Facile de changer de BDD
   - Support de multiples sources de données

4. **Testabilité** :
   - Tests unitaires simplifiés
   - Mocking plus facile

## Exemple Complet

```typescript
@Injectable()
export class GameRepository implements IGameRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Game> {
    const prismaGame = await this.prisma.game.findUnique({ 
      where: { id } 
    });
    return prismaGame ? this.toDomain(prismaGame) : null;
  }

  async save(game: Game): Promise<Game> {
    const data = this.fromDomain(game);
    const prismaGame = await this.prisma.game.create({ data });
    return this.toDomain(prismaGame);
  }

  private toDomain(prismaGame: PrismaGame): Game {
    return new Game(
      prismaGame.id,
      prismaGame.title,
      prismaGame.description,
      prismaGame.userId,
      prismaGame.createdAt,
      prismaGame.updatedAt,
    );
  }

  private fromDomain(game: Game): Prisma.GameCreateInput {
    return {
      title: game.getTitle(),
      description: game.getDescription(),
      userId: game.getUserId(),
    };
  }
}
```

## Bonnes Pratiques 📝

1. **Toujours valider** les données dans `toDomain`
2. **Ne pas exposer** les détails de Prisma
3. **Garder privées** les méthodes de mapping
4. **Tester** les conversions
5. **Documenter** les mappings complexes

## Erreurs Courantes ❌

1. ❌ Utiliser directement les modèles Prisma dans le domaine
2. ❌ Exposer les méthodes de mapping
3. ❌ Mélanger la logique métier et le mapping
4. ❌ Oublier de valider les données

## Solutions ✅

1. ✅ Toujours passer par `toDomain`/`fromDomain`
2. ✅ Garder les méthodes de mapping privées
3. ✅ Séparer la logique métier du mapping
4. ✅ Valider dans `toDomain`
