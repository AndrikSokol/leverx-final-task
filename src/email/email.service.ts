import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { Email } from './types/email.type';
import { Status } from '@/enum/status.enum';
import {
  CANCELED_STRIPE,
  SUCCESS_STRIPE,
} from '@/constants/email-html-message';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: Mailer) {}

  async send(
    emailData: Email,
    status: Status,
    vinylsName: string,
    totalPrice: number,
  ): Promise<SentMessageInfo> {
    return await this.mailer
      .sendMail({
        from: 'andreiAPI <andrushamailer@gmail.com>',
        to: emailData.to,
        subject: emailData.subject,
        html:
          status === Status.Success
            ? SUCCESS_STRIPE(vinylsName, totalPrice)
            : CANCELED_STRIPE,
      })
      .catch(() => {
        throw new HttpException(
          `Error with mail:`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
