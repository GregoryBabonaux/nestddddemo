import { Test, TestingModule } from '@nestjs/testing';
import { GameRepository } from './game.repository';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Game } from '../../domain/entities/game.entity';

describe('GameRepository', () => {
  let repository: GameRepository;
  let mockPrismaService: any;

  const mockPrismaGame = {
    id: 'game-123',
    title: 'Test Game',
    description: 'Test Description',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaGames = [
    mockPrismaGame,
    { ...mockPrismaGame, id: 'game-456' },
  ];

  beforeEach(async () => {
    mockPrismaService = {
      game: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<GameRepository>(GameRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all games', async () => {
      mockPrismaService.game.findMany.mockResolvedValue(mockPrismaGames);
      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Game);
      expect(result[0].getId()).toBe(mockPrismaGame.id);
      expect(result[0].getTitle()).toBe(mockPrismaGame.title);
      expect(mockPrismaService.game.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a game if it exists', async () => {
      mockPrismaService.game.findUnique.mockResolvedValue(mockPrismaGame);

      const result = await repository.findById('game-123');

      expect(result).toBeInstanceOf(Game);
      expect(result.getId()).toBe(mockPrismaGame.id);
      expect(result.getTitle()).toBe(mockPrismaGame.title);
      expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({
        where: { id: 'game-123' },
      });
    });

    it('should return null if game does not exist', async () => {
      mockPrismaService.game.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error if database query fails', async () => {
      mockPrismaService.game.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(repository.findById('game-123')).rejects.toThrow('Database error');
    });
  });

  describe('findByUserId', () => {
    it('should return all games for a user', async () => {
      const mockGames = [mockPrismaGame, { ...mockPrismaGame, id: 'game-456' }];
      mockPrismaService.game.findMany.mockResolvedValue(mockGames);

      const result = await repository.findByUserId('user-123');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Game);
      expect(result[0].getUserId()).toBe('user-123');
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });

    it('should return empty array if user has no games', async () => {
      mockPrismaService.game.findMany.mockResolvedValue([]);

      const result = await repository.findByUserId('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save a new game', async () => {
      const gameToSave = new Game(
        undefined,
        'New Game',
        'New Description',
        'user-123',
        new Date(),
        new Date(),
      );

      mockPrismaService.game.create.mockResolvedValue({
        ...mockPrismaGame,
        title: 'New Game',
        description: 'New Description',
      });

      const result = await repository.save(gameToSave);

      expect(result).toBeInstanceOf(Game);
      expect(result.getTitle()).toBe('New Game');
      expect(mockPrismaService.game.create).toHaveBeenCalledWith({
        data: {
          title: 'New Game',
          description: 'New Description',
          userId: 'user-123',
        },
      });
    });

    it('should throw error if save fails', async () => {
      const gameToSave = new Game(
        undefined,
        'New Game',
        'New Description',
        'user-123',
        new Date(),
        new Date(),
      );

      mockPrismaService.game.create.mockRejectedValue(new Error('Save failed'));

      await expect(repository.save(gameToSave)).rejects.toThrow('Save failed');
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      mockPrismaService.game.delete.mockResolvedValue(mockPrismaGame);

      await repository.delete('game-123');

      expect(mockPrismaService.game.delete).toHaveBeenCalledWith({
        where: { id: 'game-123' },
      });
    });

    it('should throw error if delete fails', async () => {
      mockPrismaService.game.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(repository.delete('game-123')).rejects.toThrow('Delete failed');
    });
  });
});
