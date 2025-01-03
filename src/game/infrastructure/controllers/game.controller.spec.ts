import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from '../../application/services/game.service';
import { CreateGameDto } from '../../application/dtos/create-game.dto';
import { Game } from '../../domain/entities/game.entity';

describe('GameController', () => {
  let controller: GameController;
  let mockGameService: any;

  const mockGame = new Game(
    'game-123',
    'Test Game',
    'Test Description',
    'user-123',
    new Date(),
    new Date(),
  );

  const mockGames = [mockGame, mockGame]

  const mockCreateGameDto: CreateGameDto = {
    title: 'Test Game',
    description: 'Test Description',
    userId: 'user-123',
  };

  beforeEach(async () => {
    mockGameService = {
      createGame: jest.fn(),
      getGameById: jest.fn(),
      getGamesByUserId: jest.fn(),
      getGames: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createGame', () => {
    it('should create a game successfully', async () => {
      mockGameService.createGame.mockResolvedValue(mockGame);

      const result = await controller.createGame(mockCreateGameDto);

      expect(result).toBe(mockGame);
      expect(mockGameService.createGame).toHaveBeenCalledWith(mockCreateGameDto);
    });

    it('should throw error if service throws', async () => {
      mockGameService.createGame.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createGame(mockCreateGameDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('getGames', () => {
    it('should return all games', async () => {
      mockGameService.getGames.mockResolvedValue(mockGames);
      const result = await controller.getGames();
      expect(result).toBe(mockGames);
      expect(mockGameService.getGames).toHaveBeenCalled();
    })
  })

  describe('getGame', () => {
    it('should return a game if it exists', async () => {
      mockGameService.getGameById.mockResolvedValue(mockGame);
      const result = await controller.getGame('game-123');
      expect(result).toBe(mockGame);
      expect(mockGameService.getGameById).toHaveBeenCalledWith('game-123');
    });

    it('should throw error if game not found', async () => {
      mockGameService.getGameById.mockRejectedValue(new Error('Game not found'));

      await expect(controller.getGame('non-existent')).rejects.toThrow('Game not found');
    });
  });

  describe('getGamesByUserId', () => {
    it('should return all games for a user', async () => {
      const mockGames = [mockGame, { ...mockGame, id: 'game-456' }];
      mockGameService.getGamesByUserId.mockResolvedValue(mockGames);

      const result = await controller.getGamesByUserId('user-123');

      expect(result).toBe(mockGames);
      expect(mockGameService.getGamesByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array if user has no games', async () => {
      mockGameService.getGamesByUserId.mockResolvedValue([]);

      const result = await controller.getGamesByUserId('user-123');

      expect(result).toEqual([]);
    });

    it('should throw error if service throws', async () => {
      mockGameService.getGamesByUserId.mockRejectedValue(new Error('Service error'));

      await expect(controller.getGamesByUserId('user-123')).rejects.toThrow('Service error');
    });
  });
});
