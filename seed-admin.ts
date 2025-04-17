import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource }   from 'typeorm';
import * as bcrypt      from 'bcrypt';
import { User }        from './src/users/entities/user.entity';
import { Role } from 'src/utils/common/enum/role.enum';

async function bootstrap() {

  const app = await NestFactory.createApplicationContext(AppModule);

  const ds = app.get(DataSource);

  
  const repo = ds.getRepository(User);

  const adminEmail = 'rishika.mishra@systango.com';

  
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
      
    });
    console.log('Admin user created');
  } else {
    console.log('ℹAdmin user already exists');
  }

  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});