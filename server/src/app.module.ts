import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { S3Module } from './s3/s3.module';
import { CardModule } from './card/card.module';
// import { UserServiceModule } from './user-service/user-service.module';

@Module({
  imports: [UserModule, CardModule, PrismaModule, AuthModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      }
    }), MailModule, ThrottlerModule.forRoot([
      {
        ttl: 60, // time window
        limit: 10 // max request during the window period
      }, {
        ttl: 400,
        limit: 50
      }
    ]), S3Module
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  },
  ],
})
export class AppModule { }
