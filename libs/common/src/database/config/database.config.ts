import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { RoomEntity } from '../entities/room.entity';
import { MessageEntity } from '../entities/message.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mongodb',
  url: configService.get<string>('DATABASE_URL'),
  entities: [UserEntity, RoomEntity, MessageEntity],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE') || true,
  ssl: configService.get<boolean>('DATABASE_SSL') || true,
});
