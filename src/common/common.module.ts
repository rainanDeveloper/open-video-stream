import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { SendMailConsumerProcessor } from './jobs/send-mail/processors/send-mail-consumer.processor';
import {
  emailQueueToken,
  SendMailProducerService,
} from './jobs/send-mail/services/send-mail-producer.service';
import { MailService } from './services/mail/mail.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: emailQueueToken,
    }),
  ],
  providers: [MailService, SendMailProducerService, SendMailConsumerProcessor],
  exports: [MailService, SendMailProducerService, SendMailConsumerProcessor],
})
export class CommonModule {}
