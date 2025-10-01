import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mongodb',
  url: configService.get<string>('DATABASE_URL'),
  entities: [UserEntity],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE') || true,
  ssl: configService.get<boolean>('DATABASE_SSL') || true,
});
