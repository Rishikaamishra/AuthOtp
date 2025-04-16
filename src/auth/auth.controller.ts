import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/logi.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
  
  async signup(@Body() dto: SignupDto): Promise<User> {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ token: string; user: User }> {
    const result = await this.authService.login(dto);
    if (!result) throw new UnauthorizedException('Invalid credentials or inactive/deleted user');
    return result;
  }
  
 

}