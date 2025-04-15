import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: false,
});

AppDataSource.initialize().then(async () => {
  const userRepo = AppDataSource.getRepository(User);
  const exists = await userRepo.findOneBy({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    const admin = userRepo.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin',
      isActive: true,
    });
    await userRepo.save(admin);
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
  }
  process.exit(0);
});