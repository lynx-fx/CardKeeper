import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import * as nodemailer from 'nodemailer';

@Processor('mail', {
  limiter: {
    max: 5,
    duration: 1000
  }
})
export class MailProcessor extends WorkerHost {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async process(job: Job): Promise<any> {
    if (job.name === 'reset-password') {

      const { email, link } = job.data;
      await this.transporter.sendMail({
        from: process.env.EMAIL_PASSWORD,
        to: email,
        subject: "Password reset",
        html: `
                      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                        <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                          <p style="color: #555;">You requested a password reset. Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
                          <div style="text-align: center; margin: 20px 0;">
                            <a href="${link}" 
                               style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                               Reset Password
                            </a>
                          </div>
                          <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
                          <hr style="border: none; border-top: 1px solid #ddd;">
                          <p style="color: #777; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} CardKeeper. All rights reserved.</p>
                        </div>
                      </div>
                    `,
      })
    }

  }
}