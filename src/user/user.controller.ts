import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@app/common/database/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAllUser(): Promise<UserEntity[]> {
    return this.userService.findAllUser();
  }

  @Get('one/:userId')
  async findOneUserById(
    @Param('userId') userId: string,
  ): Promise<UserEntity> {
    return this.userService.findOneUserById(userId);
  }

  @Post('create')
  async createUser(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.createUser(userData);
  }
}
