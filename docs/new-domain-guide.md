# Guide d'ajout d'un nouveau domaine

Ce guide explique comment ajouter un nouveau domaine à l'application, soit en utilisant le script automatique, soit manuellement.

## 1. Utilisation du script automatique

### Prérequis
- Windows
- PowerShell
- Accès en écriture au dossier du projet

### Étapes

1. Exécuter le script
```bash
./createNewDomain.bat --name mondomaine
```

2. Le script va créer automatiquement :
   - Toute la structure de dossiers
   - Les fichiers de base avec la bonne configuration
   - Les interfaces et implémentations nécessaires
   - un modèle initial que vous pouvez modifier selon vos besoins

## 2. Configuration manuelle après la création

Une fois le domaine créé (que ce soit via le script ou manuellement), suivez ces étapes pour l'intégrer complètement dans l'application :

### 2.1. Mise à jour du schéma Prisma

1. Ouvrir `prisma/schema.prisma`
2. Ajouter le modèle pour votre nouveau domaine an ajustant selon vos besoins :
```prisma
model MonDomaine {
  id          String    @id @default(uuid())
  title        String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("mondomaine")
}
```

3. Générer les migrations Prisma (attention, vous devez avoir postgresql installé et configuré):
```bash
npx prisma migrate dev --name add_mondomaine
```

### 2.2. Mise à jour des tokens d'injection

1. Ouvrir `src/shared/constants/injection-tokens.ts`
2. Ajouter le nouveau token :
```typescript
export const INJECTION_TOKENS = {
  // ... autres tokens
  MONDOMAINE_REPOSITORY: 'MONDOMAINE_REPOSITORY',
} as const;
```

### 2.3. Intégration dans le module principal

1. Ouvrir `src/app.module.ts`
2. Importer et ajouter le nouveau module :
```typescript
import { MondomaineModule } from './mondomaine/mondomaine.module';

@Module({
  imports: [
    // ... autres imports
    MondomaineModule,
  ],
})
export class AppModule {}
```

### 2.4. Documentation Swagger (optionnel)

1. Ajouter les décorateurs Swagger dans les DTOs :
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonDomaineDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;
}
```

2. Ajouter les décorateurs Swagger dans le controller :
```typescript
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('mondomaine')
@Controller('mondomaines')
export class MonDomaineController {
  @ApiOperation({ summary: 'Create a new mondomaine' })
  @Post()
  async create(@Body() dto: CreateMonDomaineDto) {
    // ...
  }
  // ...
}
```

## 3. Tests

1. Créer les tests unitaires dans `__tests__` pour :
   - Entity
   - Service
   - Repository
   - Controller

2. Créer les tests d'intégration dans `test` pour :
   - API endpoints
   - Repository avec la base de données

## 4. Vérification

1. Démarrer l'application :
```bash
npm run start:dev
```

2. Tester les nouveaux endpoints via Swagger :
```
http://localhost:3000/api
```

3. Vérifier que les opérations CRUD fonctionnent :
   - Création
   - Lecture
   - Mise à jour
   - Suppression

## Bonnes pratiques

1. Suivre les principes DDD :
   - Entités anémiques interdites
   - Logique métier dans le domaine
   - Infrastructure isolée du domaine

2. Conventions de nommage :
   - Noms de domaine en minuscules
   - Classes PascalCase
   - Méthodes camelCase

3. Structure des fichiers :
   - Un fichier par classe
   - Noms de fichiers en kebab-case
   - Extensions .ts pour TypeScript
