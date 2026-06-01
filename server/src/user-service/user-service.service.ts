import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AUTH_RESPONSE } from '../auth/constants/auth-messages';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { };

    async findExistingUser(user_id?: number, email?: string): Promise<User> {
        const user = user_id
            ? await this.prisma.user.findUnique({ where: { user_id } })
            : email
                ? await this.prisma.user.findUnique({ where: { email } })
                : null;

        if (!user) throw new NotFoundException({
            success: false,
            message: AUTH_RESPONSE.USER_NOT_FOUND
        });

        return user;
    }
}
