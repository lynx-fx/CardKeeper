import { Module } from '@nestjs/common';
import { UserService } from './user-service.service';
// import { UserServiceController } from './user-service.controller';

@Module({
  providers: [UserService],
  exports: [UserService]
})
export class UserServiceModule {}
