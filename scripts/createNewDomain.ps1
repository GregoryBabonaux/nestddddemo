param(
    [Parameter(Mandatory=$true)]
    [string]$name
)

# Convert to lowercase
$domainName = $name.ToLower()

# Set capitalized name for first letter
$domainNameUpper = $domainName.Substring(0, 1).ToUpper() + $domainName.Substring(1)

$domainNameFullUpper = $domainName.ToUpper();

# Base directory for the new domain
$baseDir = "src/$domainName"

# Create main domain directory
New-Item -ItemType Directory -Path $baseDir -Force

# Create subdirectories
$directories = @(
    "$baseDir/application",
    "$baseDir/application/dtos",
    "$baseDir/application/services",
    "$baseDir/domain",
    "$baseDir/domain/entities",
    "$baseDir/domain/repositories",
    "$baseDir/infrastructure",
    "$baseDir/infrastructure/controllers",
    "$baseDir/infrastructure/repositories"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force
    Write-Host "Created directory: $dir"
}

# Create base files
$files = @{
    "$baseDir/domain/entities/${domainName}.entity.ts" = @"
export class ${domainNameUpper} {
    constructor(
        private readonly id: string,
        private readonly title: string,
        private readonly description: string | null,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
    ) {
        this.validateTitle(title);
    }

    private validateTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new Error('${domainNameUpper} title cannot be empty');
        }
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string | null {
        return this.description;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
"@

    "$baseDir/domain/repositories/${domainName}.repository.interface.ts" = @"
import { ${domainNameUpper} } from '../entities/${domainName}.entity';

export interface I${domainNameUpper}Repository {
    findById(id: string): Promise<${domainNameUpper} | null>;
    save(${domainNameUpper}: ${domainNameUpper}): Promise<${domainNameUpper}>;
    delete(id: string): Promise<void>;
    findAll(): Promise<${domainNameUpper}[]>;
}
"@

    "$baseDir/infrastructure/repositories/${domainName}.repository.ts" = @"
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { I${domainNameUpper}Repository } from '../../domain/repositories/${domainName}.repository.interface';
import { ${domainNameUpper} } from '../../domain/entities/${domainName}.entity';

@Injectable()
export class ${domainNameUpper}Repository implements I${domainNameUpper}Repository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<${domainNameUpper}[]> {
        const ${domainName}s = await this.prisma.${domainName}.findMany();
        return ${domainName}s.map(this.toDomain);
    }

    async findById(id: string): Promise<${domainNameUpper} | null> {
        const ${domainName} = await this.prisma.${domainName}.findUnique({
            where: { id },
        });
        return ${domainName} ? this.toDomain(${domainName}) : null;
    }

    async save(${domainName}: ${domainNameUpper}): Promise<${domainNameUpper}> {
        const data = {
            title: ${domainName}.getTitle(),
            description: ${domainName}.getDescription(),
        };

        const saved = await this.prisma.${domainName}.upsert({
            where: { id: ${domainName}.getId() || '' },
            create: {
                ...data,
                id: ${domainName}.getId(),
                createdAt: ${domainName}.getCreatedAt(),
                updatedAt: ${domainName}.getUpdatedAt(),
            },
            update: {
                ...data,
                updatedAt: new Date(),
            },
        });

        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.${domainName}.delete({
            where: { id },
        });
    }

    private toDomain(raw: any): ${domainNameUpper} {
        return new ${domainNameUpper}(
            raw.id,
            raw.title,
            raw.description,
            raw.createdAt,
            raw.updatedAt,
        );
    }
}
"@

    "$baseDir/application/dtos/create-${domainName}.dto.ts" = @"
export class Create${domainNameUpper}Dto {
    title: string;
    description?: string;
}
"@

    "$baseDir/application/services/${domainName}.service.ts" = @"
import { Inject, Injectable } from '@nestjs/common';
import { ${domainNameUpper} } from '../../domain/entities/${domainName}.entity';
import { I${domainNameUpper}Repository } from '../../domain/repositories/${domainName}.repository.interface';
import { Create${domainNameUpper}Dto } from '../dtos/create-${domainName}.dto';
import { INJECTION_TOKENS } from '../../../shared/constants/injection-tokens';

@Injectable()
export class ${domainNameUpper}Service {
    constructor(
        @Inject(INJECTION_TOKENS.${domainNameFullUpper}_REPOSITORY)
        private readonly ${domainNameUpper}Repository: I${domainNameUpper}Repository,
    ) {}

    async create${domainNameUpper}(dto: Create${domainNameUpper}Dto): Promise<${domainNameUpper}> {
        const ${domainName} = new ${domainNameUpper}(
            undefined,
            dto.title,
            dto.description || null,
            new Date(),
            new Date(),
        );

        return this.${domainNameUpper}Repository.save(${domainName});
    }

    async get${domainNameUpper}(id: string): Promise<${domainNameUpper}> {
        const ${domainName} = await this.${domainNameUpper}Repository.findById(id);
        if (!${domainName}) {
            throw new Error('${domainName} not found');
        }
        return ${domainName};
    }

    async getAll${domainNameUpper}s(): Promise<${domainNameUpper}[]> {
        return this.${domainNameUpper}Repository.findAll();
    }

    async delete${domainNameUpper}(id: string): Promise<void> {
        await this.${domainNameUpper}Repository.delete(id);
    }
}
"@

    "$baseDir/infrastructure/controllers/${domainName}.controller.ts" = @"
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ${domainNameUpper}Service } from '../../application/services/${domainName}.service';
import { Create${domainNameUpper}Dto } from '../../application/dtos/create-${domainName}.dto';
import { ${domainNameUpper} } from '../../domain/entities/${domainName}.entity';

@Controller('${domainNameUpper}s')
export class ${domainNameUpper}Controller {
    constructor(private readonly ${domainNameUpper}Service: ${domainNameUpper}Service) {}

    @Post()
    async create(@Body() dto: Create${domainNameUpper}Dto): Promise<${domainNameUpper}> {
        return this.${domainNameUpper}Service.create${domainNameUpper}(dto);
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<${domainNameUpper}> {
        return this.${domainNameUpper}Service.get${domainNameUpper}(id);
    }

    @Get()
    async getAll(): Promise<${domainNameUpper}[]> {
        return this.${domainNameUpper}Service.getAll${domainNameUpper}s();
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.${domainNameUpper}Service.delete${domainNameUpper}(id);
    }
}
"@

    "$baseDir/${domainName}.module.ts" = @"
import { Module } from '@nestjs/common';
import { ${domainNameUpper}Controller } from './infrastructure/controllers/${domainName}.controller';
import { ${domainNameUpper}Service } from './application/services/${domainName}.service';
import { ${domainNameUpper}Repository } from './infrastructure/repositories/${domainName}.repository';
import { INJECTION_TOKENS } from '../shared/constants/injection-tokens';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

@Module({
    controllers: [${domainNameUpper}Controller],
    providers: [
        ${domainNameUpper}Service,
        {
            provide: INJECTION_TOKENS.${domainNameFullUpper}_REPOSITORY,
            useClass: ${domainNameUpper}Repository,
        },
        PrismaService,
    ],
    exports: [${domainNameUpper}Service],
})
export class ${domainNameUpper}Module {}
"@
}

# Create all the files
foreach ($file in $files.Keys) {
    Set-Content -Path $file -Value $files[$file]
    Write-Host "Created file: $file"
}

Write-Host "Domain structure created successfully!"
