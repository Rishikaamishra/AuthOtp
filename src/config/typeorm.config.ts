import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Otp } from 'src/otps/otp.entity';

console.log(`${__dirname}/../user/migration/*-migration{.ts,.js}`);


export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port:  5432,
  username: 'postgres',
  password: '12345',
  database:  'authotp',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(typeOrmConfig);