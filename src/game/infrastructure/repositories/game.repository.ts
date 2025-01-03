import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { IGameRepository } from '../../domain/repositories/game.repository.interface';
import { Game } from '../../domain/entities/game.entity';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Game[]> {
    const games = await this.prisma.game.findMany();
    return games.map(this.toDomain);
  }

  async findById(id: string): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({
      where: { id },
    });
    return game ? this.toDomain(game) : null;
  }

  async findByUserId(userId: string): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      where: { userId },
    });
    return games.map(this.toDomain);
  }

  async save(game: Game): Promise<Game> {
    const data = {
      title: game.getTitle(),
      description: game.getDescription(),
      userId: game.getUserId(),
    };

    const savedGame = await this.prisma.game.create({
      data,
    });

    return this.toDomain(savedGame);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.game.delete({
      where: { id },
    });
  }

  private toDomain(prismaGame: any): Game {
    return new Game(
      prismaGame.id,
      prismaGame.title,
      prismaGame.description,
      prismaGame.userId,
      prismaGame.createdAt,
      prismaGame.updatedAt,
    );
  }
}
