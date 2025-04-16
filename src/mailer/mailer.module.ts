
import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Exporting so it can be used in other modules
})
export class MailerModule {}