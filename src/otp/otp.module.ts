
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { User } from 'src/users/entities/user.entity';
import { OtpCleanerService } from 'src/utils/job/otp.cleaner';

@Module({
  imports: [TypeOrmModule.forFeature([Otp,User])],
  providers: [OtpService, OtpCleanerService],
  exports: [OtpService],
  controllers:[OtpController]
})
export class OtpModule {}