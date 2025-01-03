import { Game } from '../../domain/game';
import { GameRepository } from '../../domain/ports/game.repository';
import { v4 as uuidv4 } from 'uuid';

interface FirstApiGame {
  title: string;
  description: string;
}

export class FirstApiAdapter implements GameRepository {
  constructor(private readonly apiUrl: string) {}

  async findAll(): Promise<Game[]> {
    // Simuler un appel API - À remplacer par votre véritable appel API
    const apiGames: FirstApiGame[] = await this.fetchGamesFromApi();

    return apiGames.map(game => Game.create({
      id: uuidv4(),
      title: game.title,
      description: game.description,
    }));
  }

  private async fetchGamesFromApi(): Promise<FirstApiGame[]> {
    // Implémentez ici votre véritable appel API
    return [
      { title: 'Game 1', description: 'Description 1' },
      { title: 'Game 2', description: 'Description 2' },
    ];
  }
}
