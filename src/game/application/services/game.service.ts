import { Inject, Injectable } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { IGameRepository } from '../../domain/repositories/game.repository.interface';
import { CreateGameDto } from '../dtos/create-game.dto';
import { INJECTION_TOKENS } from '../../../shared/constants/injection-tokens';

@Injectable()
export class GameService {
  constructor(
    @Inject(INJECTION_TOKENS.GAME_REPOSITORY)
    private readonly gameRepository: IGameRepository,
  ) {}

  async createGame(dto: CreateGameDto): Promise<Game> {
    const game = new Game(
      undefined,
      dto.title,
      dto.description || null,
      dto.userId,
      new Date(),
      new Date(),
    );
    return this.gameRepository.save(game);
  }

  async getGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  async getGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async getGamesByUserId(userId: string): Promise<Game[]> {
    return this.gameRepository.findByUserId(userId);
  }
}
