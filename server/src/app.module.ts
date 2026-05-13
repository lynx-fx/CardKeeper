import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [UserModule, CardModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
