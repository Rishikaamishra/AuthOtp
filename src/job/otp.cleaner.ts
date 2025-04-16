import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../otp/entities/otp.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class OtpCleanerService {
  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}

  @Cron('0 * * * *') // every hour
  async handleOtpCleanup() {
    const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 mins
    await this.otpRepo.delete({ createdAt: LessThan(cutoff) });
  }
}