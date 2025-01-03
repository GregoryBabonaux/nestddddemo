# Guide du développeur

## Configuration de l'environnement de développement

1. **IDE recommandé**
   - VSCode avec les extensions suivantes :
     - ESLint
     - Prettier
     - NestJS
     - Prisma
     - Docker

2. **Configuration Git**
   ```bash
   git config --global core.autocrlf input
   git config --global core.eol lf
   ```

## Scripts disponibles

```json
{
  "scripts": {
    "build": "nest build",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "docker:dev": "docker-compose up",
    "docker:build": "docker build -t dddnest .",
    "docker:prod": "docker run -p 3000:3000 dddnest"
  }
}
```

## Workflow de développement

1. **Créer une nouvelle branche**
   ```bash
   git checkout -b feature/nom-feature
   ```

2. **Lancer l'environnement de développement**
   ```bash
   npm run docker:dev
   ```

3. **Faire des modifications**
   - Suivre l'architecture DDD
   - Respecter les principes SOLID
   - Ajouter des tests

4. **Tester**
   ```bash
   npm run test
   npm run test:e2e
   ```

5. **Commit et Push**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/nom-feature
   ```

## Conventions de code

### Nommage

1. **Fichiers**
   - Utiliser le kebab-case
   - Suffixer par le type (.entity.ts, .service.ts, etc.)
   ```
   user.entity.ts
   create-user.dto.ts
   ```

2. **Classes**
   - PascalCase
   - Suffixer par le type
   ```typescript
   export class UserEntity {}
   export class CreateUserDto {}
   ```

3. **Interfaces**
   - PascalCase
   - Préfixer par I
   ```typescript
   export interface IUserRepository {}
   ```

4. **Variables et méthodes**
   - camelCase
   ```typescript
   const userId: string;
   public async findById(): Promise<User> {}
   ```

### Structure des imports

```typescript
// 1. Imports NestJS
import { Injectable } from '@nestjs/common';

// 2. Imports tiers
import { v4 as uuidv4 } from 'uuid';

// 3. Imports locaux
import { User } from './user.entity';
```

## Tests

### Tests unitaires

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: MockType<IUserRepository>;

  beforeEach(async () => {
    // setup
  });

  it('should create a user', async () => {
    // test
  });
});
```

### Tests E2E

```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // setup
  });

  it('/users (POST)', () => {
    // test
  });
});
```

## Gestion des erreurs

1. **Exceptions personnalisées**
   ```typescript
   export class UserNotFoundException extends NotFoundException {
     constructor(userId: string) {
       super(`User with id ${userId} not found`);
     }
   }
   ```

2. **Filtres d'exception**
   ```typescript
   @Catch(Error)
   export class AllExceptionsFilter implements ExceptionFilter {
     catch(exception: Error, host: ArgumentsHost) {
       // handle error
     }
   }
   ```

## Logging

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser() {
    this.logger.log('Creating user...');
  }
}
```

## Documentation

1. **Documentation du code**
   ```typescript
   /**
    * Crée un nouvel utilisateur
    * @param createUserDto - Les données de l'utilisateur
    * @returns L'utilisateur créé
    * @throws UserAlreadyExistsException
    */
   async createUser(createUserDto: CreateUserDto): Promise<User> {
     // implementation
   }
   ```

2. **Documentation Swagger**
   ```typescript
   @ApiTags('users')
   @ApiOperation({ summary: 'Create a new user' })
   @ApiResponse({ status: 201, description: 'User created.' })
   @Post()
   async createUser(@Body() dto: CreateUserDto) {}
   ```

## Sécurité

1. Utiliser les guards NestJS
2. Valider les DTOs
3. Échapper les données sensibles
4. Utiliser HTTPS en production
5. Implémenter le rate limiting
