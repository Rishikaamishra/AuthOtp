

import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from 'typeorm';
import { Otp } from 'src/otp/entities/otp.entity';
import { Role } from 'src/utils/common/enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()       id: number;
  @Column()                      name: string;
  @Column({ unique: true })      email: string;
  @Column()                      password: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER })
 role: Role;
  @Column({ default: false })    isActive: boolean;
  @Column({ default: false })    isDeleted: boolean;

  @OneToMany(() => Otp, otp => otp.user)
  otps: Otp[];

  @CreateDateColumn()            createdAt: Date;
  @UpdateDateColumn()            updatedAt: Date;
  @DeleteDateColumn()            deletedAt?: Date;
}