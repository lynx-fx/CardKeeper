import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user-service/user-service.service';
import { RegisterUserDto } from './dto/register.dto';
import { AUTH_RESPONSE } from './constants/auth-messages';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compareHash, comparePassword } from '../../helper/hash';
import { ChangePasswordDto, ResetPasswordDto, ForgotPasswordDto, ValidateResetTokenDto } from './dto/password.dto';

jest.mock('../../helper/hash', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashpassword'),
  comparePassword: jest.fn().mockResolvedValue(true),
  hashResetCode: jest.fn().mockResolvedValue('hashedCode'),
  compareHash: jest.fn().mockResolvedValue(true),
}))

describe('AuthService', () => {
  let service: AuthService;
  let userDto: RegisterUserDto;
  let passwordDto: ChangePasswordDto;
  let resetPasswordDto: ResetPasswordDto;
  let forgotPasswordDto: ForgotPasswordDto;
  let validateResetTokenDto: ValidateResetTokenDto;

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
    sendRequestCode: jest.fn(),
  }

  beforeEach(async () => {
    userDto = new RegisterUserDto();
    userDto.userName = 'testuser';
    userDto.email = 'example@gmail.com';

    passwordDto = new ChangePasswordDto();
    passwordDto.old_password = "Password";
    passwordDto.new_password = "NewPassword";

    resetPasswordDto = new ResetPasswordDto();
    resetPasswordDto.new_password = "Newpassword";
    resetPasswordDto.email = "test@gmail.com";
    resetPasswordDto.code = "code";

    forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = "test@gmail.com";

    validateResetTokenDto = new ValidateResetTokenDto();
    validateResetTokenDto.code = "code";
    validateResetTokenDto.email = "test@gmail.com";


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

  describe('register', () => {
    it('should create user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({});

      const result = await service.register(userDto);
      expect(result).toEqual({
        success: true,
        message: AUTH_RESPONSE.REGISTER,
      });
    });

    it('should return error if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: userDto.email });
      await expect(service.register(userDto)).rejects.toThrow(ConflictException);
    });
  });


  describe('login', () => {
    it('should log in', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        userId: 1,
        email: 'example@gmail.com',
      });
      mockJwtService.sign.mockReturnValue('mocktoken');
      expect(await service.login(userDto)).toEqual({
        success: true,
        message: AUTH_RESPONSE.LOGIN,
        token: 'mocktoken'
      });
    });

    it('should throw error on invalid password', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        password: 'Test@1234',
        email: 'example@gmail.com',
      });
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.login(userDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error non existing user', async () => {
      mockUserService.findExistingUser.mockRejectedValueOnce(new NotFoundException());
      await expect(service.login(userDto)).rejects.toThrow(NotFoundException);
    });

  });

  describe('change password', () => {
    it('shoud change users password', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        password: 'Test@1234',
        email: 'example@gmail.com',
      });
      expect(await service.changePassword(1, passwordDto)).toEqual({
        success: true,
        message: AUTH_RESPONSE.PASSWORD,
      });
    });

    it('should reject invalid password', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        password: 'Test@1234',
        email: 'example@gmail.com',
      });
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.changePassword(1, passwordDto))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should handle non existing user', async () => {
      mockUserService.findExistingUser.mockRejectedValueOnce(new NotFoundException());
      await expect(service.changePassword(1, passwordDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('reset password', () => {
    it("should reset user's password", async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        password: 'Test@1234',
        email: 'example@gmail.com',
        token: "code"
      });

      expect(await service.resetPassword(resetPasswordDto)).toEqual({
        success: true,
        message: "Password updated"
      });
    });

    it("shouldn't let user change password without token", async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        email: 'example@gmail.com',
      });

      await expect(service.resetPassword(resetPasswordDto))
        .rejects
        .toThrow(ConflictException);
    });

    it("should check for token before changing password", async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        password: 'Test@1234',
        email: 'example@gmail.com',
        token: "code"
      });
      (compareHash as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.resetPassword(resetPasswordDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('forgot password', () => {
    it("should let user request mail", async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        email: 'example@gmail.com',
      });
      mockMailService.sendRequestCode.mockResolvedValueOnce({});

      expect(await service.forgotPassword(forgotPasswordDto)).toEqual({
        success: true,
        message: AUTH_RESPONSE.FORGOT
      })
    });

    it("should not mail non existing user", async () => {
      mockUserService.findExistingUser.mockRejectedValueOnce(new NotFoundException());

      await expect(service.forgotPassword(forgotPasswordDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('validate reset token', () => {
    it('should validate reset token', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        email: 'example@gmail.com',
        token: 'code',
      });

      expect(await service.validateResetToken(validateResetTokenDto)).toEqual({ success: true });
    });

    it('should throw error when user has missing reset token', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        email: 'example@gmail.com',
      });

      await expect(service.validateResetToken(validateResetTokenDto))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw error on invalid token', async () => {
      mockUserService.findExistingUser.mockResolvedValueOnce({
        email: 'example@gmail.com',
        token: 'code',
      });

      (compareHash as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.validateResetToken(validateResetTokenDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

});
