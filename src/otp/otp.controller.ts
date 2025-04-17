
import {
  Controller, Post, Body, Request, UseGuards
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiResponse, ApiBody
} from '@nestjs/swagger';

class VerifyDto {
  actualOtp: string;
}

@ApiTags('OTP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate OTP for logged‑in user' })
  @ApiResponse({
    status: 201,
    description: 'Returns the saved OTP record',
    schema: {
      type: 'object',
      properties: {
        id:        { type: 'number', example: 123 },
        actualOtp: { type: 'string', example: '654321' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  generate(@Request() req) {
    return this.otpService.generateOtp(req.user);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify an OTP code' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        actualOtp: { type: 'string', example: '654321' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP is valid', schema: { example: { verified: true } } })
  @ApiResponse({ status: 400, description: 'OTP invalid or expired', schema: { example: { verified: false } } })
  verify(@Request() req, @Body() dto: VerifyDto) {
    return this.otpService.verify(req.user.userId, dto.actualOtp)
      .then(ok => ({ verified: ok }));
  }
}