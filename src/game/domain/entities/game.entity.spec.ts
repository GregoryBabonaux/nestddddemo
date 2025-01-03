import { Game } from './game.entity';

describe('Game Entity', () => {
  const mockGameData = {
    id: 'game-123',
    title: 'Test Game',
    description: 'Test Description',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a game instance', () => {
    const game = new Game(
      mockGameData.id,
      mockGameData.title,
      mockGameData.description,
      mockGameData.userId,
      mockGameData.createdAt,
      mockGameData.updatedAt,
    );

    expect(game).toBeDefined();
    expect(game.getId()).toBe(mockGameData.id);
    expect(game.getTitle()).toBe(mockGameData.title);
    expect(game.getDescription()).toBe(mockGameData.description);
    expect(game.getUserId()).toBe(mockGameData.userId);
    expect(game.getCreatedAt()).toBe(mockGameData.createdAt);
    expect(game.getUpdatedAt()).toBe(mockGameData.updatedAt);
  });

  it('should create a game instance with null description', () => {
    const game = new Game(
      mockGameData.id,
      mockGameData.title,
      null,
      mockGameData.userId,
      mockGameData.createdAt,
      mockGameData.updatedAt,
    );

    expect(game).toBeDefined();
    expect(game.getDescription()).toBeNull();
  });

  // Test de validation des données (si on ajoute des validations dans l'entité)
  it('should not allow empty title', () => {
    expect(() => {
      new Game(
        mockGameData.id,
        '',
        mockGameData.description,
        mockGameData.userId,
        mockGameData.createdAt,
        mockGameData.updatedAt,
      );
    }).toThrow('Game title cannot be empty');
  });

  it('should not allow empty userId', () => {
    expect(() => {
      new Game(
        mockGameData.id,
        mockGameData.title,
        mockGameData.description,
        '',
        mockGameData.createdAt,
        mockGameData.updatedAt,
      );
    }).toThrow('User ID cannot be empty');
  });
});
