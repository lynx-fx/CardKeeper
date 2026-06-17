import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user-service/user-service.service';
import { RegisterUserDto } from './dto/register.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, ValidateResetTokenDto } from './dto/password.dto';
import { AUTH_RESPONSE } from './constants/auth-messages';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let prismaService: PrismaService;
    let userDto: RegisterUserDto;
    let passwordDto: ChangePasswordDto;
    let resetPasswordDto: ResetPasswordDto;
    let forgotPasswordDto: ForgotPasswordDto;
    let validateResetTokenDto: ValidateResetTokenDto;

    const mockMailService = {
        sendRequestCode: jest.fn(),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({ secret: 'test-secret' })],
            providers: [
                AuthService,
                PrismaService,
                UserService,
                { provide: MailService, useValue: mockMailService }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
    })

    beforeEach(async () => {
        userDto = new RegisterUserDto();
        userDto.userName = 'testuser';
        userDto.email = 'example@gmail.com';
        userDto.email = 'example@gmail.com';
        userDto.password = 'password@123';


        passwordDto = new ChangePasswordDto();
        passwordDto.old_password = "password@123";
        passwordDto.new_password = "NewPassword";

        resetPasswordDto = new ResetPasswordDto();
        resetPasswordDto.new_password = "Newpassword";
        resetPasswordDto.email = "example@gmail.com";
        resetPasswordDto.code = "code";

        forgotPasswordDto = new ForgotPasswordDto();
        forgotPasswordDto.email = 'example@gmail.com';

        validateResetTokenDto = new ValidateResetTokenDto();
        validateResetTokenDto.code = "code";
        validateResetTokenDto.email = "example@gmail.com";

        await prismaService.user.deleteMany();
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    })

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('register', () => {
        it('should create user', async () => {
            expect(await authService.register(userDto)).toEqual({
                success: true,
                message: AUTH_RESPONSE.REGISTER,
            })
        });

        it('should throw error if user already exists', async () => {
            await authService.register(userDto);
            await expect(authService.register(userDto))
                .rejects
                .toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should login user', async () => {
            await authService.register(userDto);
            expect(await authService.login(userDto)).toEqual({
                success: true,
                message: AUTH_RESPONSE.LOGIN,
                token: expect.any(String),
            });
        });

        it('should throw error if password is incorrect', async () => {
            await authService.register(userDto);
            userDto.password = "wrongPassword"
            await expect(authService.login(userDto))
                .rejects
                .toThrow(UnauthorizedException);
            userDto.password = "password@123"
        });

        it('should throw error if user is non existent', async () => {
            await expect(authService.login(userDto))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('change password', () => {
        it('should change password', async () => {
            await authService.register(userDto);
            const user = await prismaService.user.findUnique({ where: { email: userDto.email } });
            expect(user).not.toBeNull();

            expect(await authService.changePassword(+user!.userId, passwordDto)).toEqual({
                success: true,
                message: AUTH_RESPONSE.PASSWORD,
            })
        });

        it('should throw error if user is non existent', async () => {
            await expect(authService.changePassword(1, passwordDto))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should throw error on invalid password', async () => {
            await authService.register(userDto);
            const user = await prismaService.user.findUnique({ where: { email: userDto.email } });
            expect(user).not.toBeNull();

            passwordDto.old_password = "wrongPassword";

            await expect(authService.changePassword(+user!.userId, passwordDto)).
                rejects
                .toThrow(UnauthorizedException);
        });
    });

    describe('forgot password', () => {
        it('should send a mail with reset password link', async () => {
            await authService.register(userDto);
            mockMailService.sendRequestCode.mockResolvedValueOnce(true);
            expect(await authService.forgotPassword(forgotPasswordDto)).toEqual({
                success: true,
                message: AUTH_RESPONSE.FORGOT,
                code: expect.any(String),
            });
        });

        it('should handle none existent users', async () => {
            await expect(authService.forgotPassword(forgotPasswordDto))
                .rejects
                .toThrow(NotFoundException);
        })
    });

    describe('reset-password', () => {
        it('should change users password', async () => {
            // creating user
            await authService.register(userDto);

            // adding token
            const result = await authService.forgotPassword(userDto);
            resetPasswordDto.code = (result as any).code;
            expect(await authService.resetPassword(resetPasswordDto)).toEqual({
                success: true,
                message: "Password updated"
            });
        });

        it('should handle invalid tokens', async () => {
            // creating user
            await authService.register(userDto);

            // adding token
            await authService.forgotPassword(userDto);
            await expect(authService.resetPassword(resetPasswordDto))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should throw error when user doesnt exists', async () => {
            await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('validate reset token', () => {
        it('should validate reset token', async () => {
            await authService.register(userDto);
            const result = await authService.forgotPassword(forgotPasswordDto);
            validateResetTokenDto.code = (result as any).code;
            expect(await authService.validateResetToken(validateResetTokenDto))
                .toEqual({
                    success: true,
                });
        });

        it('should throw error when user is non existent', async () => {
            await expect(authService.validateResetToken(validateResetTokenDto))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should throw error on invalid token', async () => {
            await authService.register(userDto);
            await authService.forgotPassword(forgotPasswordDto);
            await expect(authService.validateResetToken(validateResetTokenDto))
                .rejects
                .toThrow(UnauthorizedException);
        })
    })
});
