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
import { channel } from 'diagnostics_channel';

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
        userDto.password = 'password@123';

        passwordDto = new ChangePasswordDto();
        passwordDto.old_password = "password@123";
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
        })
    });
});
