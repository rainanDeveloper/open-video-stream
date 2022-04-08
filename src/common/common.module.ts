import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';

@Module({
  providers: [MailService],
})
export class CommonModule {}
