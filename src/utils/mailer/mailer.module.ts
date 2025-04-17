
import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService], 
})
export class MailerModule {}