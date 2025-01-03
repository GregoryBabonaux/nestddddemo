import { Game } from '../game';

export interface GameRepository {
  findAll(): Promise<Game[]>;
}
