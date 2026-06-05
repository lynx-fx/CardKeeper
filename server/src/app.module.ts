import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { S3Module } from './s3/s3.module';
import { CardModule } from './card/card.module';
import { ImageModule } from './image/image.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [UserModule, CardModule, PrismaModule, AuthModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      }
    }), MailModule, ThrottlerModule.forRoot([
      {
        ttl: 60, // time window in seconds
        limit: 30 // max request during the window period
      }, {
        ttl: 400,
        limit: 120
      }
    ]), S3Module, ImageModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  },
  ],
})
export class AppModule { }
