// 
import {
  Controller, Get, Patch, Param, Query, UseGuards
} from '@nestjs/common';
import { AdminService } from './admin.sevice';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/utils/common/guards';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role }         from 'src/utils/common/enum/role.enum';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiParam, ApiQuery, ApiResponse
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('users/:id/activate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Activate a user (admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'User activated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(+id);
  }

  @Get('users')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List users (admin only)' })
  @ApiQuery({ name: 'page',  required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated user list',
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 42,
        users: [ /* array of user objects */ ]
      },
    },
  })
  listUsers(
    @Query('page')  page  = '1',
    @Query('limit') limit = '10',
  ) {
    return this.adminService.listUsers(+page, +limit);
  }

  @Get('users/deleted')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List soft‑deleted users' })
  @ApiResponse({
    status: 200,
    description: 'Array of deleted users',
    schema: { example: [ /...user objects.../ ] },
  })
  listDeletedUsers() {
    return this.adminService.listDeleted();
  }

  @Get('otps')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all OTP entries' })
  @ApiResponse({
    status: 200,
    description: 'Array of OTP records with user data',
    schema: { example: [ { id: 1, actualOtp: '123456', user: { id:1, email:'a@b.com' }, createdAt: '2025-04-17T...' } ] },
  })
  listOtps() {
    return this.adminService.listOtps();
  }
}