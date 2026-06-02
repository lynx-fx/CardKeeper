import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3Module } from '../s3/s3.module';
import { UserServiceModule } from '../user-service/user-service.module';

@Module({
  imports: [S3Module, UserServiceModule],
  controllers: [ImageController, ],
  providers: [ImageService],
})
export class ImageModule {}
