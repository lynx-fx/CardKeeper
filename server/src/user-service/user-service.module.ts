import { Module } from '@nestjs/common';
import { UserService } from './user-service.service';

@Module({
  providers: [UserService],
  exports: [UserService]
})

export class UserServiceModule {}