import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { OtpCleanerService } from './utils/job/otp.cleaner';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    AuthModule,
    AdminModule,
    UsersModule,
    OtpModule
  ],
  
})
export class AppModule {}
