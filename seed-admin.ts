import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource }   from 'typeorm';
import * as bcrypt      from 'bcrypt';
import { User }        from './src/users/entities/user.entity';
import { Role } from 'src/utils/common/enum/role.enum';

async function bootstrap() {
  // 1) Create an application context (so ConfigModule loads .env, TypeORM connects, etc)
  const app = await NestFactory.createApplicationContext(AppModule);

  // 2) Grab the DataSource directly
  const ds = app.get(DataSource);

  // 3) Get the User repository by the class, not by name
  const repo = ds.getRepository(User);

  const adminEmail = 'rishika.mishra@systango.com';

  // 4) Check for existing
  const existing = await repo.findOne({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await repo.insert({
      name:      'Rishika Mishra',
      email:     'rishika.mishra@systango.com',
      password:  passwordHash,
      role:      Role.ADMIN,
      isActive:  true,
      isDeleted: false,
      // createdAt/updatedAt will be set automatically by @CreateDateColumn/@UpdateDateColumn
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});