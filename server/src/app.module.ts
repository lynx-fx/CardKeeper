import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { ImageModule } from './image/image.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, CardModule, ImageModule, PrismaModule, AuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
