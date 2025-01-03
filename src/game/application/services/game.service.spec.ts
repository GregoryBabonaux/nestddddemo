import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from '../../domain/entities/game.entity';
import { CreateGameDto } from '../dtos/create-game.dto';
import { INJECTION_TOKENS } from '../../../shared/constants/injection-tokens';

describe('GameService', () => {
  let service: GameService;
  let mockGameRepository: any;

  const mockGame = new Game(
    'game-123',
    'Test Game',
    'Test Description',
    'user-123',
    new Date(),
    new Date(),
  );

  const mockGames = [
    mockGame,
    new Game(
      'game-456',
      'Test Game 2',
      'Test Description 2',
      'user-123',
      new Date(),
      new Date(),
    ),
  ];

  const mockCreateGameDto: CreateGameDto = {
    title: 'Test Game',
    description: 'Test Description',
    userId: 'user-123',
  };

  beforeEach(async () => {
    mockGameRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: INJECTION_TOKENS.GAME_REPOSITORY,
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGame', () => {
    it('should create a game successfully', async () => {
      mockGameRepository.save.mockResolvedValue(mockGame);

      const result = await service.createGame(mockCreateGameDto);

      expect(result).toEqual(mockGame);
      expect(mockGameRepository.save).toHaveBeenCalled();
      expect(result.getTitle()).toBe(mockCreateGameDto.title);
      expect(result.getDescription()).toBe(mockCreateGameDto.description);
      expect(result.getUserId()).toBe(mockCreateGameDto.userId);
    });

    it('should create a game without description', async () => {
      const dtoWithoutDescription = {
        title: 'Test Game',
        userId: 'user-123',
      };

      const mockGameWithoutDescription = new Game(
        'game-123',
        'Test Game',
        null,
        'user-123',
        new Date(),
        new Date(),
      );

      mockGameRepository.save.mockResolvedValue(mockGameWithoutDescription);

      const result = await service.createGame(dtoWithoutDescription);

      expect(result.getDescription()).toBeNull();
      expect(mockGameRepository.save).toHaveBeenCalled();
    });

    it('should throw error if save fails', async () => {
      mockGameRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.createGame(mockCreateGameDto)).rejects.toThrow('Save failed');
    });
  });

  describe('getGames', () => {
    it('should return all games', async () => {
      mockGameRepository.findAll.mockResolvedValue(mockGames);
      const result = await service.getGames();
      expect(result).toEqual(mockGames);
      expect(result).toHaveLength(2);
      expect(mockGameRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getGameById', () => {
    it('should return a game if it exists', async () => {
      mockGameRepository.findById.mockResolvedValue(mockGame);

      const result = await service.getGameById('game-123');

      expect(result).toEqual(mockGame);
      expect(mockGameRepository.findById).toHaveBeenCalledWith('game-123');
    });

    it('should throw error if game not found', async () => {
      mockGameRepository.findById.mockResolvedValue(null);

      await expect(service.getGameById('non-existent')).rejects.toThrow('Game not found');
    });
  });

  describe('getGamesByUserId', () => {
    it('should return all games for a user', async () => {
      const mockGames = [
          mockGame,
          new Game(
          'game-456',
          'Test Game 2',
          'Test Description 2',
          'user-123',
          new Date(),
          new Date(),
        ),
      ];
      mockGameRepository.findByUserId.mockResolvedValue(mockGames);

      const result = await service.getGamesByUserId('user-123');

      expect(result).toEqual(mockGames);
      expect(mockGameRepository.findByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array if user has no games', async () => {
      mockGameRepository.findByUserId.mockResolvedValue([]);

      const result = await service.getGamesByUserId('user-123');

      expect(result).toEqual([]);
    });

    it('should throw error if findByUserId fails', async () => {
      mockGameRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      await expect(service.getGamesByUserId('user-123')).rejects.toThrow('Database error');
    });
  });
});
