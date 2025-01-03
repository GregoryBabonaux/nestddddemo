export class Game {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string | null,
    private readonly userId: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validateTitle(title);
    this.validateUserId(userId);
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Game title cannot be empty');
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
