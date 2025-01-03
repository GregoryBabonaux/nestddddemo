# Guide DDD pour Développeurs Juniors

Salut ! 👋 Ce guide est fait pour t'aider à comprendre les concepts du Domain-Driven Design (DDD) à travers notre projet. On va prendre des exemples concrets et expliquer chaque concept simplement.

## Table des matières
1. [C'est quoi le DDD ?](#cest-quoi-le-ddd-)
2. [Notre Architecture](#notre-architecture)
3. [Les Concepts Clés](#les-concepts-clés)
4. [Exemples Concrets](#exemples-concrets)
5. [FAQ](#faq)

## C'est quoi le DDD ?

Imagine que tu construis une maison 🏠. Tu ne commences pas par choisir la couleur des rideaux, mais par comprendre les besoins des habitants :
- Combien de chambres ?
- Cuisine ouverte ou fermée ?
- Garage nécessaire ?

Le DDD, c'est pareil ! On commence par comprendre le "domaine métier" (les besoins réels) avant de coder.

## Notre Architecture

Notre projet est divisé en 3 grandes parties (comme les étages d'une maison) :

### 1. Domain (Le Cœur) ❤️
```
src/
└── user/
    └── domain/
        ├── entities/
        │   └── user.entity.ts    # Définit ce qu'est un utilisateur
        └── repositories/
            └── user.repository.interface.ts  # Comment sauvegarder un utilisateur
```

C'est comme les plans de la maison. On y définit les règles importantes :
```typescript
// user.entity.ts
export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,    // Un utilisateur doit avoir un email
    private readonly username: string, // Et un nom d'utilisateur
  ) {}
}
```

### 2. Application (Les Services) 🛠️
```
src/
└── user/
    └── application/
        ├── dtos/
        │   └── create-user.dto.ts    # Format des données entrantes
        └── services/
            └── user.service.ts       # Logique métier
```

C'est comme l'architecte de la maison. Il reçoit les demandes et s'assure qu'elles sont bien exécutées :
```typescript
// user.service.ts
@Injectable()
export class UserService {
  async createUser(dto: CreateUserDto) {
    // Vérifie si l'email n'est pas déjà utilisé
    // Crée l'utilisateur
    // Le sauvegarde
  }
}
```

### 3. Infrastructure (La Technique) 🔧
```
src/
└── user/
    └── infrastructure/
        ├── controllers/
        │   └── user.controller.ts    # Gère les requêtes HTTP
        └── repositories/
            └── user.repository.ts    # Sauvegarde en base de données
```

C'est comme la plomberie et l'électricité. On ne les voit pas mais c'est essentiel :
```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
```

## Les Concepts Clés

### 1. Entité (Entity) 🎯
C'est un objet avec une identité unique.

Dans notre projet :
- Un `User` est une entité car chaque utilisateur est unique (il a un ID)
- Un `Game` est une entité car chaque jeu est unique (il a un ID)

```typescript
// Exemple d'entité
export class User {
  // L'ID rend l'utilisateur unique
  constructor(private readonly id: string) {}
}
```

### 2. Value Object (Objet Valeur) 📦
C'est un objet sans identité, seules ses valeurs comptent.

Exemple simple :
```typescript
export class Email {
  constructor(private readonly value: string) {
    // Vérifie que c'est un email valide
    if (!value.includes('@')) {
      throw new Error('Email invalide');
    }
  }
}
```

### 3. Repository (Entrepôt) 🗄️
C'est comme un libraire qui s'occupe de sauvegarder et retrouver nos entités.

Dans notre projet :
```typescript
// Interface (le contrat)
export interface IUserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<User>;
}

// Implémentation (le vrai travail)
export class UserRepository implements IUserRepository {
  async findById(id: string) {
    // Va chercher dans la base de données
  }
}
```

### 4. Service (Service Métier) 🔨
C'est là où on met la logique qui ne rentre pas naturellement dans une entité.

```typescript
export class UserService {
  async registerUser(email: string, password: string) {
    // Vérifie si l'email existe déjà
    // Crypte le mot de passe
    // Crée l'utilisateur
    // Envoie un email de bienvenue (on utilisera les évènments pour cela)
  }
}
```

## Exemples Concrets

### Exemple 1 : Créer un utilisateur

1. La requête arrive au controller :
```typescript
@Post()
async createUser(@Body() dto: CreateUserDto) {
  // dto contient email et password
}
```

2. Le service vérifie et crée l'utilisateur :
```typescript
async createUser(dto: CreateUserDto) {
  // Vérifie si l'email existe
  const existingUser = await this.userRepository.findByEmail(dto.email);
  if (existingUser) {
    throw new Error('Email déjà utilisé');
  }

  // Crée le nouvel utilisateur
  const user = new User(undefined, dto.email, dto.password);
  
  // Sauvegarde
  return this.userRepository.save(user);
}
```

## FAQ

### Q: Pourquoi on sépare tout en dossiers ?
R: C'est comme ranger son salon ! Chaque chose a sa place :
- `domain` : Les règles importantes
- `application` : La logique métier
- `infrastructure` : La technique

### Q: C'est quoi la différence entre Entity et DTO ?
R: 
- Entity : C'est l'objet métier (comme dans la base de données)
- DTO : C'est juste pour transférer des données (comme un formulaire), y appliquer des règles de validations pour les contrôleurs, et retourner une erreur si besoin (fail fast)

### Q: Pourquoi on utilise des interfaces pour les repositories ?
R: C'est comme un contrat ! On définit ce qu'on veut faire (interface) avant de décider comment le faire (implémentation).

### Q: Je dois créer tous ces fichiers à chaque fois ?
R: Oui, mais :
1. Suis le guide [new-domain-guide.md](./new-domain-guide.md)
2. Tu peux copier-coller la structure de base
3. C'est pour avoir un code propre, compréhensible, maintenable et évolutif (en route vers CQRS !)

### Q: Comment je sais si quelque chose est une Entity ou un Value Object ?
R: Pose-toi la question :
- "Est-ce que j'ai besoin de le traquer individuellement ?" → Entity
- "Seules les valeurs sont importantes ?" → Value Object

### Q: Je fais quoi si je ne sais pas où mettre mon code ?
R: Suis ces étapes :
1. Est-ce une règle métier importante ? → `domain`
2. Est-ce de la logique d'application ? → `application`
3. Est-ce technique (DB, API, etc.) ? → `infrastructure`

## Conseils pour Débuter

1. **Commence petit** : Comprends bien un module avant d'en créer un nouveau
2. **Copie-colle** : Inspire-toi des modules existants
3. **Pose des questions** : C'est normal de ne pas tout comprendre au début
4. **Utilise les outils** : 
   - VSCode t'aide avec l'autocomplétion
   - La documentation Swagger montre les API
   - Les tests montrent comment le code doit fonctionner

## Ressources Utiles

1. [new-domain-guide.md](./new-domain-guide.md) - Pour créer un nouveau module
2. [project-structure.md](./project-structure.md) - Pour comprendre l'organisation
3. [api-documentation.md](./api-documentation.md) - Pour voir les API disponibles

N'hésite pas à revenir à ce guide quand tu as un doute ! 🚀
