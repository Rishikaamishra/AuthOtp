import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(name: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ name, email, password: hash });
    return this.userRepository.save(user);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findDeleted() {
    return this.userRepository.find({ where: { isDeleted: true } });
  }

  activateUser(userId: string) {
    return this.userRepository.update(userId, { isActive: true });
  }

  findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
