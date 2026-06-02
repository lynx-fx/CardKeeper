import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { UserServiceModule } from '../user-service/user-service.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [UserServiceModule, S3Module],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
