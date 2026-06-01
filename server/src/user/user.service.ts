import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
    }

    async findAllUsers() {
        return this.prisma.user.findMany({
            // where: {isActive: true}
        })
    }

    async findUserById(userId: number) {
        return this.prisma.user.findUnique({
            where: {
                userId
            },
        })
    }
}
