import { Inject, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  // imports: [PrismaService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
