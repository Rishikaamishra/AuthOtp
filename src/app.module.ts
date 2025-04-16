import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ this makes env variables available app-wide
    DatabaseModule,
    AuthModule,
    AdminModule,
    UsersModule,
    OtpModule
  ],
})
export class AppModule {}
