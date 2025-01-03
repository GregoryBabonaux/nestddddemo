export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly username: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {
    this.validateEmail(email);
    this.validatePassword(password);
    this.validateUsername(username);
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private validateUsername(username: string): void {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
