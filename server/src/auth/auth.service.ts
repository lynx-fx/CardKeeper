import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, LoginUserReponse } from './dto/login.dto';
import { RegisterUserDto, RegisterUserResponse } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compareHash, comparePassword, hashPassword, hashResetCode } from '../../helper/hash';
import { AUTH_RESPONSE } from './constants/auth-messages';
import { JwtService } from '@nestjs/jwt';
import { changePasswordDto, changePasswordResponse, forgotPasswordDto, forgotPasswordResponse, resetPasswordDto, resetPasswordResponse, validateResetTokenDto, validateResetTokenResponse } from './dto/password.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from "crypto";
import { UserService } from '../user-service/user-service.service';
import { User } from '@prisma/client';

const frontend = process.env.NODE_ENV == "production"
  ? process.env.FRONT_END_HOSTED
  : process.env.FRONT_END_LOCAL;

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
  }

  // DONE: login
  async login(dto: LoginUserDto): Promise<LoginUserReponse> {
    const existingUser: User = await this.userService.findExistingUser(undefined, dto.email);

    const isMatch = await comparePassword(dto.password, existingUser.password);
    if (!isMatch) throw new UnauthorizedException({
      success: false,
      message: AUTH_RESPONSE.INVALID_CREDENTIALS
    });;

    const payload = {
      userId: existingUser.userId,
    }

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: AUTH_RESPONSE.LOGIN,
      token
    };
  }


  // DONE: register
  async register(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    const existingUser = await this.prisma.user.findUnique({where:{email: dto.email}});
    if (existingUser) throw new ConflictException({
      success: false,
      message: AUTH_RESPONSE.USER_ALREADY_EXISTS
    });

    const hashedPassword = await hashPassword(dto.password);

    await this.prisma.user.create({
      data: {
        userName: dto.userName,
        email: dto.email,
        password: hashedPassword,
      }
    })

    return {
      success: true,
      message: AUTH_RESPONSE.REGISTER,
    }
  }

  // DONE: change pass
  async changePassword(userId: number, dto: changePasswordDto): Promise<changePasswordResponse> {
    const existingUser: User = await this.userService.findExistingUser(userId);

    const isMatch: boolean = await comparePassword(dto.old_password, existingUser.password);

    if (!isMatch) throw new UnauthorizedException({
      success: false,
      message: AUTH_RESPONSE.INVALID_CREDENTIALS
    });;

    await this.prisma.user.update({
      where: { userId: userId },
      data: {
        password: await hashPassword(dto.new_password)
      }
    })

    return {
      success: true,
      message: AUTH_RESPONSE.PASSWORD,
    }
  }

  // DONE: reset pass
  async resetPassword(dto: resetPasswordDto): Promise<resetPasswordResponse> {
    const existingUser: User = await this.userService.findExistingUser(undefined, dto.email);

    if (!existingUser.token) throw new ConflictException({
      success: false,
      message: AUTH_RESPONSE.USER_ALREADY_EXISTS
    });

    const isValid = await compareHash(dto.code, existingUser.token);
    if (!isValid) throw new ConflictException({
      success: false,
      message: AUTH_RESPONSE.USER_ALREADY_EXISTS
    });

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        password: await hashPassword(dto.new_password),
        token: null
      }
    })

    return {
      success: true,
      message: "Password updated"
    }
  }

  // DONE: forgot password
  async forgotPassword(dto: forgotPasswordDto): Promise<forgotPasswordResponse> {
    const code = crypto.randomInt(100000, 1000000).toString()

    const existingUser: User = await this.userService.findExistingUser(undefined, dto.email);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        token: await hashResetCode(code),
      }
    })

    const link = `${frontend}?email=${dto.email}&code=${code}`

    await this.mailService.sendRequestCode(dto.email, link);

    return {
      success: true,
      message: AUTH_RESPONSE.FORGOT
    }
  }


  // DONE: validate reset token
  async validateResetToken(dto: validateResetTokenDto): Promise<validateResetTokenResponse> {
    const existingUser: User = await this.userService.findExistingUser(undefined, dto.email);
    if (!existingUser.token) throw new UnauthorizedException({
      success: false,
      message: AUTH_RESPONSE.UNAUTHORIZED
    });

    const isValid = await compareHash(dto.code, existingUser.token);
    if (!isValid) throw new UnauthorizedException({
      success: false,
      message: AUTH_RESPONSE.UNAUTHORIZED
    });

    return {
      success: true,
    }
  }

}