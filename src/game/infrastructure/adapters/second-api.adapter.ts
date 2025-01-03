import { Game } from '../../domain/game';
import { GameRepository } from '../../domain/ports/game.repository';
import { v4 as uuidv4 } from 'uuid';

interface SecondApiGame {
  name: string;
  content: string;
  release_at: string;
}

export class SecondApiAdapter implements GameRepository {
  constructor(private readonly apiUrl: string) {}

  async findAll(): Promise<Game[]> {
    // Simuler un appel API - À remplacer par votre véritable appel API
    const apiGames: SecondApiGame[] = await this.fetchGamesFromApi();
    
    return apiGames.map(game => Game.create({
      id: uuidv4(),
      title: game.name,
      description: game.content,
      releaseDate: new Date(game.release_at)
    }));
  }

  private async fetchGamesFromApi(): Promise<SecondApiGame[]> {
    // Implémentez ici votre véritable appel API
    return [
      { 
        name: 'Game 1', 
        content: 'Content 1',
        release_at: '2024-01-01'
      },
      { 
        name: 'Game 2', 
        content: 'Content 2',
        release_at: '2024-02-01'
      }
    ];
  }
}
