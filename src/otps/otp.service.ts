import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { User } from 'src/users/users.entity';
import { LessThan } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async generateOtp(userId: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await this.userRepo.findOneBy({ id: userId });
  
    if (!user) throw new Error('User not found');
  
    const otpEntity = this.otpRepo.create({ actualOtp: otp, user });
    return this.otpRepo.save(otpEntity);
  }
  

  async verifyOtp(userId: string, otp: string) {
    const record = await this.otpRepo.findOne({
      where: { user: { id: userId }, actualOtp: otp },
      relations: ['user'],
    });
    if (!record) return false;
    const now = new Date().getTime();
    const created = new Date(record.createdAt).getTime();
    return now - created <= 10 * 60 * 1000;
  }

  findAll() {
    return this.otpRepo.find({ relations: ['user'] });
  }

  async deleteExpiredOtps() {
    const threshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
    await this.otpRepo.delete({
      createdAt: LessThan(threshold),
    });
  }
}
