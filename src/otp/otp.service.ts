import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  // Method to generate and save OTP
  async generateOtp(user): Promise<Otp> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpEntity = new Otp();
    otpEntity.actualOtp = otp;
    otpEntity.user = user;
    return this.otpRepository.save(otpEntity);
  }

  // Method to get all OTPs
  async findAll(): Promise<Otp[]> {
    return this.otpRepository.find({ relations: ['user'] });
  }
}



