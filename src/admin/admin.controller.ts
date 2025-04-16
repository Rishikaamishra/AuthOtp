import {
    Controller,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { AdminService } from './admin.sevice';
  import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
  import { RolesGuard } from 'src/common/guards';
  import { Roles } from 'src/utils/decorators/roles.decorator';
  import { Role } from 'src/common/enum/role.enum';
  import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
  
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Controller('admin')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    @Patch('users/:id/activate')
    @ApiOperation({ summary: 'Activate a user by ID' })
    activateUser(@Param('id') id: number) {
      return this.adminService.activateUser(id);
    }
  
    @Get('users')
    @ApiOperation({ summary: 'List all users with pagination/filtering' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'sort', required: false })
    @ApiQuery({ name: 'order', required: false })
    @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
    listUsers(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('sort') sort = 'createdAt',
      @Query('order') order: 'ASC' | 'DESC' = 'DESC',
      @Query('status') status?: 'active' | 'inactive',
    ) {
      return this.adminService.getUserList(+page, +limit, sort, order, status);
    }
  
    @Get('users/deleted')
    @ApiOperation({ summary: 'List soft-deleted users' })
    listDeletedUsers() {
      return this.adminService.getDeletedUsers
    }
  
    @Get('otps')
    @ApiOperation({ summary: 'List all OTP entries' })
    listOtps() {
      return this.adminService.getOtpList
    }
  }