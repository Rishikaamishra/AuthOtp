import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { OtpModule } from '../otp/otp.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.sevice'; 
import { AuthModule } from 'src/auth/auth.module'; 

@Module({
  imports: [UsersModule, OtpModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
