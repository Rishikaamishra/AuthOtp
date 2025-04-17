


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }    from 'typeorm';
import { User }          from './entities/user.entity';

interface ListOpts {
  page: number;
  limit: number;
  status?: 'active' | 'inactive';
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(opts: ListOpts) {
    const { page, limit, status } = opts;
    const where: any = { isDeleted: false };
    if (status === 'active')   where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [data, total] = await this.repo.findAndCount({
      where,
      skip : (page-1)*limit,
      take : limit,
      order: { createdAt: 'DESC' },
    });

    return { page, limit, total, data };
  }

  findDeleted() {
    return this.repo.find({ where: { isDeleted: true } });
  }

  async activateUser(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    u.isActive = true;
    return this.repo.save(u);
  }

  /** Soft‑delete a user by setting isDeleted = true */
  async remove(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isDeleted = true;
    return this.repo.save(user);
  }
}