// import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { SignupDto } from './dto/signup.dto';
// import { LoginDto } from './dto/logi.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from 'src/mailer/mailer.service';
// import { Role } from 'src/common/enum/role.enum';
// import { Otp } from 'src/otp/entities/otp.entity';
// import { OtpService } from 'src/otp/otp.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User) private userRepo: Repository<User>,
//     @InjectRepository(Otp) private otpRepo: Repository<Otp>,
//     private jwtService: JwtService,
//     private mailService: MailService,
//     private otpService: OtpService, // Injecting OtpService
//   ) {}

//   // Signup method
//   async signup(signupDto: SignupDto) {
//     const { name, email, password } = signupDto;
//     console.log("gsgadgjsd",SignupDto)

//     // Check if the user already exists
//     // const existingUser = await this.userRepo.findOne({ where: { email } });
//     // if (existingUser) {
//     //   throw new ConflictException('User already exists');
//     // }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user object
//     const user = this.userRepo.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: Role.USER,
//       isDeleted: false,
//       isActive: false,
//     });

//     // Save the new user to the database
//     const newUser = await this.userRepo.save(user);

//     // Generate OTP for the new user
//     await this.otpService.generateOtp(newUser);

//     // Send the welcome email to the new user
//     await this.mailService.sendWelcomeEmail(name, email);

//     // Notify admin about the new user registration
//     // await this.mailService.notifyAdmin({ name: newUser.name, email: newUser.email });

//     return newUser;
//   }

//   // Login method
//   async login(dto: LoginDto): Promise<{ token: string; user: User } | null> {
//     console.log(bcrypt.hash('Admin@123', 10))
//     const user = await this.userRepo.findOne({ where: { email: dto.email } });
//     console.log(bcrypt.hash('Admin@123', 10))

//     if (!user || user.isDeleted || !user.isActive) {
//       throw new UnauthorizedException('Invalid credentials or inactive/deleted user');
//     }

//     const passwordValid = await bcrypt.compare(dto.password, user.password);
//     console.log(bcrypt.hash('Admin@123', 10))
//     console.log(passwordValid);
//     if (!passwordValid) {
//       throw new UnauthorizedException('Invalid credentials or inactive/deleted user');

//     }

//     const token = this.jwtService.sign({ id: user.id, role: user.role });

//     return { token, user };
//   }
// }

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }    from 'typeorm';
import * as bcrypt       from 'bcrypt';
import { JwtService }    from '@nestjs/jwt';
import { User }          from 'src/users/entities/user.entity';
import { OtpService }    from 'src/otp/otp.service';
import { MailService }   from 'src/utils/mailer/mailer.service';
import { SignupDto }     from './dto/signup.dto';
import { LoginDto } from './dto/logi.dto';
import { Role }          from 'src/utils/common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
    private mail: MailService,
    private otp:  OtpService,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email in use');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save({
      name: dto.name,
      email: dto.email,
      password: hash,
      role: Role.USER,
      isActive: false,
      isDeleted: false,
    });

    // generate + send OTP
    const record = await this.otp.generateOtp(user);
    await this.mail.sendOtpEmail(user.email, record.actualOtp);

    // welcome & admin notify
    await this.mail.sendWelcomeEmail(user.name, user.email);
    await this.mail.notifyAdmin({ name:user.name, email:user.email });

    return { message:'Signup OK, OTP sent.' };
  }

  async login(dto: LoginDto) {
    const u = await this.users.findOne({ where: { email: dto.email } });
    if (!u || u.isDeleted || !u.isActive) return null;
    const ok = await bcrypt.compare(dto.password, u.password);
    if (!ok) return null;
    const token = this.jwt.sign({ sub:u.id, role:u.role });
    return { token, user: u };
  }
}