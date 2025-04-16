import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: keyof User;
    order?: 'ASC' | 'DESC';
    isActive?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
      isActive,
    } = query;

    const where: any = { isDeleted: false };
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }


  async activateUser(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    user.isActive = true;
    await this.userRepository.save(user);
    return 'User activated';
  }

  async getPaginatedUsers(
    page: number,
    limit: number,
    sort: string,
    order: 'ASC' | 'DESC',
    status?: 'active' | 'inactive',
  ) {
    const where: any = { isDeleted: false };
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, page, limit, users };
  }

  


async softDeleteUser(id: number): Promise<string> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) throw new NotFoundException('User not found');

  user.isDeleted = true;
  await this.userRepository.softRemove(user);

  return `User with ID ${id} has been soft-deleted.`;
}

async findDeleted(): Promise<User[]> {
  return this.userRepository.find({
    withDeleted: true,
    where: {
      deletedAt: Not(IsNull()),
    },
    select: ['id', 'name', 'email', 'role', 'deletedAt'],
  });
}
}