import { User } from './user.entity';

describe('User Entity', () => {
  const validUserData = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a valid user instance', () => {
    const user = new User(
      validUserData.id,
      validUserData.email,
      validUserData.password,
      validUserData.username,
      validUserData.createdAt,
      validUserData.updatedAt,
    );

    expect(user).toBeDefined();
    expect(user.getId()).toBe(validUserData.id);
    expect(user.getEmail()).toBe(validUserData.email);
    expect(user.getPassword()).toBe(validUserData.password);
    expect(user.getUsername()).toBe(validUserData.username);
    expect(user.getCreatedAt()).toBe(validUserData.createdAt);
    expect(user.getUpdatedAt()).toBe(validUserData.updatedAt);
  });

  describe('Email Validation', () => {
    it('should not allow empty email', () => {
      expect(() => {
        new User(
          validUserData.id,
          '',
          validUserData.password,
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Email cannot be empty');
    });

    it('should not allow invalid email format', () => {
      expect(() => {
        new User(
          validUserData.id,
          'invalid-email',
          validUserData.password,
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Invalid email format');
    });

    it('should accept valid email format', () => {
      expect(() => {
        new User(
          validUserData.id,
          'test@example.com',
          validUserData.password,
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).not.toThrow();
    });
  });

  describe('Password Validation', () => {
    it('should not allow empty password', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          '',
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Password cannot be empty');
    });

    it('should not allow password shorter than 8 characters', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          'short',
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Password must be at least 8 characters long');
    });

    it('should accept valid password', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          'password123',
          validUserData.username,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).not.toThrow();
    });
  });

  describe('Username Validation', () => {
    it('should not allow empty username', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          validUserData.password,
          '',
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Username cannot be empty');
    });

    it('should not allow username shorter than 3 characters', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          validUserData.password,
          'ab',
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Username must be at least 3 characters long');
    });

    it('should accept valid username', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.email,
          validUserData.password,
          'testuser',
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).not.toThrow();
    });
  });
});