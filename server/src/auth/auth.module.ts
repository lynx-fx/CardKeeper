import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { UserServiceModule } from '../user-service/user-service.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }), MailModule, UserServiceModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}