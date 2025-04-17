
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Otp }  from './entities/otp.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)  private otpRepo: Repository<Otp>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async generateOtp(user: User) {
    const code = Math.floor(100000 + Math.random()*900000).toString();
    return this.otpRepo.save({ actualOtp: code, user });
  }

  async verify(userId: number, code: string) {
    const r = await this.otpRepo.findOne({
      where: { user:{id:userId}, actualOtp:code },
      order: { createdAt:'DESC' }
    });
    return r ? (Date.now() - r.createdAt.getTime() < 600_000) : false;
  }

  async findAll() {
    return this.otpRepo.find({ relations:['user'] });
  }

  async removeExpired() {
    const cutoff = new Date(Date.now() - 600_000);
    await this.otpRepo.delete({ createdAt: LessThan(cutoff) });
  }
}


