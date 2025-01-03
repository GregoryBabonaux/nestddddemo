import { Game } from '../../domain/game';
import { GameRepository } from '../../domain/ports/game.repository';

export class FederatedGamesAdapter implements GameRepository {
  constructor(
    private readonly repositories: GameRepository[]
  ) {}

  async findAll(): Promise<Game[]> {
    const allGamesPromises = this.repositories.map(repo => repo.findAll());
    const allGamesArrays = await Promise.all(allGamesPromises);
    
    // Aplatir le tableau de tableaux en un seul tableau
    return allGamesArrays.flat();
  }
}
