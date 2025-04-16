import { Controller, Get, Query, Param, Patch, UseGuards, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('Admin/User Management')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name' })
  @ApiQuery({ name: 'order', required: false, example: 'ASC' })
  @ApiQuery({ name: 'isActive', required: false, example: 'true' })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    const validSortFields: (keyof User)[] = ['id', 'name', 'email', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as keyof User)
      ? (sortBy as keyof User)
      : 'createdAt';

    return this.userService.findAll({
      page: 1,
      limit: 10,
      sortBy: sortField,
      order: order || 'DESC',
      isActive: isActiveBool,
    });
  }

  @Get('deleted')
  getDeletedUsers() {
    return this.userService.findDeleted();
  }

  @Patch(':id/activate')
  activateUser(@Param('id') id: string) {
    return this.userService.activateUser(+id);
  }

  @Delete(':id')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiOperation({ summary: 'Soft delete a user' })
deleteUser(@Param('id') id: number) {
  return this.userService.softDeleteUser(id);
}
}