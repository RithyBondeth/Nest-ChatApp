import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ UserEntity ])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
