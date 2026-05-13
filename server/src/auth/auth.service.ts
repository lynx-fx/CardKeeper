import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // TODO: login
  async login(email: string, password: string) {

  }

  // TODO: register

  // TODO: change pass

  // TODO: reset pass

  // TODO: forgot password

  // TODO: validate reset token

}
