// 


import { 
  Controller, Post, Body, HttpCode, HttpStatus 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto }   from './dto/signup.dto';
import { LoginDto } from './dto/logi.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name:     { type: 'string', example: 'John Doe' },
        email:    { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'StrongP@ssw0rd' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed / User already exists' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email:    { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'StrongP@ssw0rd' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1…' },
        user: {
          type: 'object',
          properties: {
            id:        { type: 'number', example: 1 },
            name:      { type: 'string', example: 'John Doe' },
            email:     { type: 'string', example: 'john@example.com' },
            role:      { type: 'string', example: 'user' },
            isActive:  { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive user' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}