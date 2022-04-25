import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../../../services/mail/mail.service';
import { SendMailJobDto } from '../../dto/send-mail-job.dto';
import { TemplateEmailMessage } from '../../../interfaces/IMailMessage.interface';
import {
  emailQueueJobs,
  emailQueueToken,
} from '../services/send-mail-producer.service';

@Processor(emailQueueToken)
export class SendMailConsumerProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process(emailQueueJobs.SendConfirmationEmailJob)
  async sendMailJob(job: Job<SendMailJobDto>) {
    const { userEmail, userLogin, otgCode, app_name } = job.data;

    const emailMessage: TemplateEmailMessage = {
      template: 'user-confirmation',
      to: {
        name: userLogin,
        email: userEmail,
      },
      subject: `Verify your email | ${app_name}`,
      context: {
        login: userLogin,
        email: userEmail,
        app_name,
        otgCode,
      },
    };

    try {
      this.mailService.sendTemplateEmail(emailMessage);
    } catch (error) {
      throw new Error(
        `Error while trying to send confirmation email: ${error}`,
      );
    }
  }
}
