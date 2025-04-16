import { Otp } from 'src/otp/entities/otp.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
  } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ default: 'user' })
    role: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ default: false })
    isDeleted: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;  // <-- new field for soft delete

    @OneToMany(()=>Otp, otp => otp.user)
    otps: Otp[];
  }

