export class Game {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly releaseDate?: Date,
  ) {}

  static create(props: {
    id: string;
    title: string;
    description: string;
    releaseDate?: Date;
  }): Game {
    return new Game(props.id, props.title, props.description, props.releaseDate);
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getReleaseDate(): Date | undefined {
    return this.releaseDate;
  }
}
