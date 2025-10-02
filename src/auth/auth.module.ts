import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/database/entities/user.entity';
import { JwtModule } from '@app/common/jwt/jwt.module';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
