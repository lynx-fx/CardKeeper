import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user-service/user-service.service';
import { RegisterUserDto } from './dto/register.dto';
import { AUTH_RESPONSE } from './constants/auth-messages';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { comparePassword } from '../../helper/hash';

jest.mock('../../helper/hash', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashpassword'),
  comparePassword: jest.fn().mockResolvedValue(true),
  hashResetCode: jest.fn().mockResolvedValue('hashedCode'),
  compareHash: jest.fn().mockResolvedValue(true),
}))

describe('AuthService', () => {
  let service: AuthService;
  let dto: RegisterUserDto;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    }
  }

  const mockUserService = {
    findExistingUser: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  const mockMailService = {
    sendResetPasswordEmail: jest.fn(),
  }

  beforeEach(async () => {
    dto = new RegisterUserDto();
    dto.userName = 'testuser';
    dto.email = 'example@gmail.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // register
  it('should create user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
    mockPrismaService.user.create.mockResolvedValueOnce({});

    const result = await service.register(dto);
    expect(result).toEqual({
      success: true,
      message: AUTH_RESPONSE.REGISTER,
    });
  });

  it('should return error if user already exists', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email });
    await expect(service.register(dto)).rejects.toThrow(ConflictException);
  });


  // login
  it('should log in', async () => {
    mockUserService.findExistingUser.mockResolvedValueOnce({
      userId: 1,
      email: 'example@gmail.com',
    })
    expect(await service.login(dto)).toEqual({
      success: true,
      message: AUTH_RESPONSE.LOGIN,
    })
  });

  it('should throw error on invalid password', async () => {
    mockUserService.findExistingUser.mockResolvedValueOnce({
      password: 'Test@1234',
      email: 'example@gmail.com',
    });
    (comparePassword as jest.Mock).mockResolvedValueOnce(false);
    await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw error non existing user', async () => {
    mockUserService.findExistingUser.mockRejectedValueOnce(new NotFoundException());
    await expect(service.login(dto)).rejects.toThrow(NotFoundException);
  });

  // reset password

});
