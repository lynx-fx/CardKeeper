import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // TODO: login
  @Post()
  async login(@Body('email') email: string,
    @Body('password') password: string) {
    return this.login(email, password);
  }

  // TODO: register

  // TODO: change pass

  // TODO: reset pass

  // TODO: forgot password

  // TODO: validate reset token

}
