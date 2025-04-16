import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const repo = dataSource.getRepository('User');

  const adminEmail = 'rishika.mishra@systango.com';

  const adminExists = await repo.findOneBy({ email: adminEmail });
  if (!adminExists) {
    await repo.insert({
      name: 'Rishikaaaa',
      email: adminEmail,
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin',
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  await app.close();
}
bootstrap();
