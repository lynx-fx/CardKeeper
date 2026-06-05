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
        from: process.env.EMAIL,
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
    } else if (job.name === "expiry-reminder") {
      const { userName, email, productName, warantyExpiry } = job.data;
      const expiryDate = new Date(warantyExpiry);
      const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Warranty Expiry Reminder",
        html: `
                      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 24px; border-radius: 10px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);">
                          <h2 style="color: #222; text-align: center; margin-bottom: 8px;">Warranty Expiry Reminder</h2>
                          <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                          <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            This is a friendly reminder that the warranty for your <strong>${productName}</strong> is set to expire on <strong>${formattedExpiry}</strong>.
                          </p>

                          <div style="background: #f7fbff; border: 1px solid #dce7f2; border-radius: 8px; padding: 16px; margin: 20px 0;">
                            <p style="margin: 0; color: #1a416f; font-size: 15px;"><strong>Product:</strong> ${productName}</p>
                            <p style="margin: 6px 0 0 0; color: #1a416f; font-size: 15px;"><strong>Expiry Date:</strong> ${formattedExpiry}</p>
                          </div>

                          <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            If you want to keep your coverage active, please review your purchase details and any available renewal options before the expiry date.
                          </p>

                          <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have already renewed or no longer need this product, you can ignore this message.</p>

                          <hr style="border: none; border-top: 1px solid #e1e8ef; margin: 24px 0;">
                          <p style="color: #777; font-size: 13px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} CardKeeper. All rights reserved.</p>
                        </div>
                      </div>
                    `,
      })
    }

  }

}