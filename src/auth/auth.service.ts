import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/logi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mailer/mailer.service';
import { Role } from 'src/common/enum/role.enum';
import { Otp } from 'src/otp/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private jwtService: JwtService,
    private mailService: MailService,
    private otpService: OtpService, // Injecting OtpService
  ) {}

  // Signup method
  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    console.log("gsgadgjsd",SignupDto)

    // Check if the user already exists
    // const existingUser = await this.userRepo.findOne({ where: { email } });
    // if (existingUser) {
    //   throw new ConflictException('User already exists');
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: Role.USER,
      isDeleted: false,
      isActive: false,
    });

    // Save the new user to the database
    const newUser = await this.userRepo.save(user);

    // Generate OTP for the new user
    await this.otpService.generateOtp(newUser);

    // Send the welcome email to the new user
    await this.mailService.sendWelcomeEmail(name, email);

    // Notify admin about the new user registration
    // await this.mailService.notifyAdmin({ name: newUser.name, email: newUser.email });

    return newUser;
  }

  // Login method
  async login(dto: LoginDto): Promise<{ token: string; user: User } | null> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    

    if (!user || user.isDeleted || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or inactive/deleted user');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials or inactive/deleted user');

    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return { token, user };
  }
}