import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ExpiryReminderDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQeue: Queue) { }

  async sendRequestCode(email: string, link: string) {
    await this.mailQeue.add("reset-password", {
      email, link
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    })
  };

  async sendExpiryReminderMail(dto: ExpiryReminderDto){
    await this.mailQeue.add("expiry-reminder", {
      userName: dto.userName,
      email: dto.email,
      productName: dto.productName,
      warrantyExpiry: dto.warrantyExpiry
    },{
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 10000,
      }
    })
  };
}