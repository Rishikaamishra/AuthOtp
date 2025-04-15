import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from 'src/utils/guards/jwtAuth.guard';

@Controller('otp')
@UseGuards(JwtAuthGuard)
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('generate/:userId')
  generate(@Param('userId') userId: string) {
    return this.otpService.generateOtp(userId);
  }

  @Post('verify/:userId')
  verify(@Param('userId') userId: string, @Body('otp') otp: string) {
    return this.otpService.verifyOtp(userId, otp);
  }
}