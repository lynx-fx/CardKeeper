import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { UserServiceModule } from '../user-service/user-service.module';

@Module({
  imports: [UserServiceModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
