import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/utils/guards/jwtAuth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('deleted-users')
  getDeletedUsers() {
    return this.usersService.findDeleted();
  }

  @Patch('activate/:id')
  activateUser(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }
}
