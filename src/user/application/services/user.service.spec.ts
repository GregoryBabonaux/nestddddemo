import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { INJECTION_TOKENS } from '../../../shared/constants/injection-tokens';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'password123',
    username: 'Test User',
  };

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn().mockImplementation(async (user) => {
        // Simuler le comportement de la base de données qui retourne un User
        return new User(
          'user-123',
          user.getEmail(),
          user.getPassword(),
          user.getUsername(),
          user.getCreatedAt(),
          user.getUpdatedAt(),
        );
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: INJECTION_TOKENS.USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password before saving', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.createUser(mockCreateUserDto);

      // Vérifier que le mot de passe a été hashé
      expect(result.getPassword()).not.toBe(mockCreateUserDto.password);
      
      // Vérifier que le hash est valide
      const isValidHash = await bcrypt.compare(
        mockCreateUserDto.password,
        result.getPassword(),
      );
      expect(isValidHash).toBe(true);
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(
        new User(
          'existing-user',
          mockCreateUserDto.email,
          'hashedPassword',
          mockCreateUserDto.username,
          new Date(),
          new Date(),
        ),
      );

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await service.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await service.verifyPassword('wrongpassword', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user if exists', async () => {
      const mockUser = new User(
        'user-123',
        'test@test.com',
        'hashedPassword',
        'Test User',
        new Date(),
        new Date(),
      );
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById('user-123');
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('non-existent')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
