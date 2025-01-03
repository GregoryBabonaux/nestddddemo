import { Game } from '../entities/game.entity';

export interface IGameRepository {
  findById(id: string): Promise<Game | null>;
  findByUserId(userId: string): Promise<Game[]>;
  save(game: Game): Promise<Game>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Game[]>;
}
