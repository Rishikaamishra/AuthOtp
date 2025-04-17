import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/utils/common/guards';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role }         from 'src/utils/common/enum/role.enum';
import { User }         from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(User)               
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List users (filter by status)' })
  @ApiQuery({ name: 'page',   required: false, example: 1 })
  @ApiQuery({ name: 'limit',  required: false, example: 10 })
  @ApiQuery({
    name:     'status',
    required: false,
    enum:     ['active', 'inactive'],
    example:  'active',
  })
  @ApiOkResponse({
    description: 'Paginated list of users',
    schema: {
      type: 'object',
      properties: {
        page:   { type: 'number', example: 1 },
        limit:  { type: 'number', example: 10 },
        total:  { type: 'number', example: 42 },
        data: {
          type:  'array',
          items: { $ref: getSchemaPath(User) },  
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async listUsers(
    @Query('page')   page   = '1',
    @Query('limit')  limit  = '10',
    @Query('status') status?: string,
  ) {
    const cleanStatus: 'active' | 'inactive' | undefined =
      status === 'active' || status === 'inactive' ? status : undefined;

    return this.usersService.findAll({
      page:   +page,
      limit:  +limit,
      status: cleanStatus,
    });
  }

  @Get('deleted')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List soft‑deleted users' })
  @ApiOkResponse({
    description: 'Soft‑deleted users',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(User) },
      example: [
        {
          id: 2,
          name: 'Bob',
          email: 'bob@example.com',
          role: 'user',
          isActive: false,
          isDeleted: true,
          deletedAt: '2025-03-01T00:00:00Z',
        },
      ],
    },
  })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  getDeletedUsers() {
    return this.usersService.findDeleted();
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  @ApiOkResponse({
    description: 'User activated successfully',
    schema: {
      example: { id: 3, isActive: true },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: { example: { statusCode: 404, message: 'User not found' } },
  })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  activateUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.activateUser(id);
  }


  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft‑delete a user (Admin only)' })
  @ApiParam({ name: 'id', type: 'integer', example: 42 })
  @ApiOkResponse({
    description: 'The user has been soft‑deleted',
    schema: {
      $ref: getSchemaPath(User),
    },
  })
  @ApiNotFoundResponse({
    description: 'No user found with that ID',
    schema: { example: { statusCode: 404, message: 'User not found' } },
  })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}