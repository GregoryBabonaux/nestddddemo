# Guide pas à pas : Ajouter un nouveau domaine

Ce guide explique comment ajouter un nouveau domaine à l'application en suivant l'architecture DDD.

## Étape 1 : Créer la structure de dossiers

```bash
src/
└── nouveau-domaine/
    ├── application/
    │   ├── dtos/
    │   └── services/
    ├── domain/
    │   ├── entities/
    │   └── repositories/
    └── infrastructure/
        ├── controllers/
        └── repositories/
```

## Étape 2 : Créer l'entité de domaine

1. Créer `src/nouveau-domaine/domain/entities/nouveau-domaine.entity.ts` :

```typescript
export class NouveauDomaine {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  // ... autres getters
}
```

## Étape 3 : Définir l'interface du repository

1. Créer `src/nouveau-domaine/domain/repositories/nouveau-domaine.repository.interface.ts` :

```typescript
import { NouveauDomaine } from '../entities/nouveau-domaine.entity';

export interface INouveauDomaineRepository {
  findById(id: string): Promise<NouveauDomaine | null>;
  save(entity: NouveauDomaine): Promise<NouveauDomaine>;
  delete(id: string): Promise<void>;
}
```

## Étape 4 : Créer les DTOs

1. Créer `src/nouveau-domaine/application/dtos/create-nouveau-domaine.dto.ts` :

```typescript
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNouveauDomaineDto {
  @ApiProperty()
  @IsString()
  name: string;
}
```

## Étape 5 : Implémenter le service applicatif

1. Créer `src/nouveau-domaine/application/services/nouveau-domaine.service.ts` :

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { INouveauDomaineRepository } from '../../domain/repositories/nouveau-domaine.repository.interface';
import { CreateNouveauDomaineDto } from '../dtos/create-nouveau-domaine.dto';
import { NouveauDomaine } from '../../domain/entities/nouveau-domaine.entity';
import { INJECTION_TOKENS } from '../../../shared/constants/injection-tokens';

@Injectable()
export class NouveauDomaineService {
  constructor(
    @Inject(INJECTION_TOKENS.NOUVEAU_DOMAINE_REPOSITORY)
    private readonly repository: INouveauDomaineRepository,
  ) {}

  async create(dto: CreateNouveauDomaineDto): Promise<NouveauDomaine> {
    const entity = new NouveauDomaine(
      undefined,
      dto.name,
      new Date(),
      new Date(),
    );

    return this.repository.save(entity);
  }
}
```

## Étape 6 : Implémenter le repository

1. Créer `src/nouveau-domaine/infrastructure/repositories/nouveau-domaine.repository.ts` :

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { INouveauDomaineRepository } from '../../domain/repositories/nouveau-domaine.repository.interface';
import { NouveauDomaine } from '../../domain/entities/nouveau-domaine.entity';

@Injectable()
export class NouveauDomaineRepository implements INouveauDomaineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<NouveauDomaine | null> {
    const result = await this.prisma.nouveauDomaine.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async save(entity: NouveauDomaine): Promise<NouveauDomaine> {
    const data = {
      name: entity.getName(),
    };

    const result = await this.prisma.nouveauDomaine.create({
      data,
    });

    return this.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.nouveauDomaine.delete({
      where: { id },
    });
  }

  private toDomain(prismaEntity: any): NouveauDomaine {
    return new NouveauDomaine(
      prismaEntity.id,
      prismaEntity.name,
      prismaEntity.createdAt,
      prismaEntity.updatedAt,
    );
  }
}
```

## Étape 7 : Créer le controller

1. Créer `src/nouveau-domaine/infrastructure/controllers/nouveau-domaine.controller.ts` :

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NouveauDomaineService } from '../../application/services/nouveau-domaine.service';
import { CreateNouveauDomaineDto } from '../../application/dtos/create-nouveau-domaine.dto';

@ApiTags('nouveau-domaine')
@Controller('nouveau-domaine')
export class NouveauDomaineController {
  constructor(private readonly service: NouveauDomaineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  async create(@Body() dto: CreateNouveauDomaineDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an entity by id' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
```

## Étape 8 : Créer le module

1. Créer `src/nouveau-domaine/nouveau-domaine.module.ts` :

```typescript
import { Module } from '@nestjs/common';
import { NouveauDomaineController } from './infrastructure/controllers/nouveau-domaine.controller';
import { NouveauDomaineService } from './application/services/nouveau-domaine.service';
import { NouveauDomaineRepository } from './infrastructure/repositories/nouveau-domaine.repository';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';
import { INJECTION_TOKENS } from '../shared/constants/injection-tokens';

@Module({
  controllers: [NouveauDomaineController],
  providers: [
    NouveauDomaineService,
    PrismaService,
    {
      provide: INJECTION_TOKENS.NOUVEAU_DOMAINE_REPOSITORY,
      useClass: NouveauDomaineRepository,
    },
  ],
  exports: [NouveauDomaineService],
})
export class NouveauDomaineModule {}
```

## Étape 9 : Mettre à jour le schéma Prisma

1. Ajouter le modèle dans `prisma/schema.prisma` :

```prisma
model NouveauDomaine {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Étape 10 : Intégration finale

1. Ajouter le token d'injection dans `src/shared/constants/injection-tokens.ts` :

```typescript
export const INJECTION_TOKENS = {
  // ... autres tokens
  NOUVEAU_DOMAINE_REPOSITORY: 'INouveauDomaineRepository',
} as const;
```

2. Importer le module dans `src/app.module.ts` :

```typescript
import { NouveauDomaineModule } from './nouveau-domaine/nouveau-domaine.module';

@Module({
  imports: [
    // ... autres modules
    NouveauDomaineModule,
  ],
})
export class AppModule {}
```

3. Générer la migration Prisma :

```bash
npx prisma migrate dev --name add_nouveau_domaine
```

## Étape 11 : Test

1. Redémarrer l'application
2. Vérifier la documentation Swagger pour les nouveaux endpoints
3. Tester les endpoints avec des requêtes HTTP
