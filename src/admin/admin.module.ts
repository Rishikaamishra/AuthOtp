import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { OtpModule } from '../otp/otp.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.sevice'; // Fix typo: from sevice to service
import { AuthModule } from 'src/auth/auth.module'; // Assuming this exists

@Module({
  imports: [UsersModule, OtpModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
