import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService) {
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async sendExpiryReminder() {
        // search for 7 days expiry date here
        const target = new Date();
        target.setDate(target.getDate() + 7);

        const start = new Date(target);
        start.setHours(0, 0, 0, 0);

        const end = new Date(target);
        end.setHours(23, 59, 59, 999);

        const cards = await this.prisma.card.findMany({
            where: {
                // in exactly 7 days
                warrantyExpiry: {
                    gte: start,
                    lte: end
                },
            },
            include: {
                user: {
                    select: {
                        userId: true,
                        email: true,
                        userName: true
                    }
                }
            },
        });

        for (const card of cards) {
            await this.mailService.sendExpiryReminderMail({
                userName: card.user.userName,
                email: card.user.email,
                productName: card.productName,
                warrantyExpiry: card.warrantyExpiry
            }
            );
        }


    }
}
