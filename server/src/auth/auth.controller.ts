import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query,  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto, RegisterUserResponse } from './dto/register.dto';
import { changePasswordDto, forgotPasswordDto, forgotPasswordResponse, resetPasswordDto, resetPasswordResponse, validateResetTokenDto, validateResetTokenResponse } from './dto/password.dto';
import { JwtGuard } from '../../guard/jwtVerifyGuard';

type loginResponse = {
  success: boolean;
  message: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // DONE: login
  @Post("login")
  async login(@Body() dto: LoginUserDto): Promise<loginResponse> {
    return this.authService.login(dto);
  }

  // DONE: register
  @Post("register")
  async register(@Body() dto: RegisterUserDto): Promise<RegisterUserResponse> {
    return this.authService.register(dto);
  }

  // DONE: change pass
  @Post("change-password")
  @UseGuards(JwtGuard)
  async changePassword(@Request() req, @Body() dto: changePasswordDto) {
    return this.authService.changePassword(+req.user.user_id, dto);
  }

  // DONE: reset pass
  @Post("reset-password")
  async resetPassword(@Body() dto: resetPasswordDto): Promise<resetPasswordResponse> {
    return this.authService.resetPassword(dto);
  }

  // DONE: forgot password
  @Post("forgot-password")
  async forgotPassword(@Body() dto: forgotPasswordDto): Promise<forgotPasswordResponse> {
    return this.authService.forgotPassword(dto);
  }

  // DONE: validate reset token
  @Post("validate-reset-token")
  async validateResetToken(@Body() dto: validateResetTokenDto): Promise<validateResetTokenResponse> {
    return this.authService.validateResetToken(dto);
  }
}
