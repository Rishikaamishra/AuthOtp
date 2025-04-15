import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OtpService } from './otp.service';

@Injectable()
export class OtpCleanupService {
  constructor(private otpService: OtpService) {}

  @Cron('0 * * * *')
  handleCleanup() {
    return this.otpService.deleteExpiredOtps();
  }
}