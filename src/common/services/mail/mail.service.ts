import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {
  BodyEmailMessage,
  TemplateEmailMessage,
} from 'src/common/interfaces/IMailMessage.interface';

@Injectable()
export class MailService {
  transporter: any;

  constructor(private readonly config: ConfigService) {
    const mailHost = config.get('MAIL_HOST');

    if (mailHost) {
      this.transporter = nodemailer.createTransport({
        host: config.get('MAIL_HOST'),
        port: Number.parseInt(config.get('MAIL_PORT')),
        secure: config.get('MAIL_SECURE') == 'true',
        auth: {
          user: config.get('MAIL_USER'),
          pass: config.get('MAIL_PASSWORD'),
        },
        tls: { rejectUnauthorized: false },
      });
    }
  }

  async sendEmail(message: BodyEmailMessage) {
    if (!this.transporter) {
      return;
    }
    const mailMessage: Mail.Options = {
      from: {
        name: this.config.get('MAIL_FROM_NAME'),
        address: this.config.get('MAIL_FROM_ADDRESS'),
      },
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      subject: message.subject,
      html: message.body,
    };
    return await this.transporter.sendMail(mailMessage);
  }

  async sendTemplateEmail(message: TemplateEmailMessage) {
    if (!this.transporter) {
      return;
    }
    const filename = path.join(
      this.config.get('MAIL_TEMPLATE_PATH') || 'email-templates',
      `${message.template}.ejs`,
    );

    if (!fs.existsSync(filename))
      throw new Error('Template de e-mail não encontrado');

    const templateString = fs.readFileSync(filename, { encoding: 'utf-8' });

    const body = await ejs.render(
      templateString,
      {
        context: message.context,
        async: true,
      },
      { async: true },
    );

    return await this.sendEmail({ ...message, body });
  }
}
