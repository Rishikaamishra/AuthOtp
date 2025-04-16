import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  async activateUser(userId: number): Promise<string> {
    return this.userService.activateUser(userId);
  }

  async getUserList(
    page: number,
    limit: number,
    sort: string,
    order: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ) {
    return this.userService.getPaginatedUsers(page, limit, sort, order, status);
  }

  async getOtpList() {
    return this.otpService.findAll();
  }

  async getDeletedUsers() {
    return this.userService.findDeleted();
  }
}