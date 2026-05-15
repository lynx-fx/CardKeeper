import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

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
  }
}