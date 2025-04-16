import { Controller , Body ,Post, HttpStatus,Res} from "@nestjs/common";
import { Response } from 'express';
import { OtpService } from "./otp.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  async generateOtp(@Body() body:any) {
       console.log(body.userId,"from")
    return await this.otpService.generateOtp(body.userId);
  }
  }