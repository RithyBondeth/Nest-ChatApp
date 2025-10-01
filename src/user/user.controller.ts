import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
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
  async findOneUserById(@Param('userId') userId: string): Promise<UserEntity> {
    return this.userService.findOneUserById(userId);
  }

  @Post('create')
  async createUser(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.createUser(userData);
  }

  @Patch('update/:userId')
  async updateUserById(
    @Param('userId') userId: string,
    @Body() userData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.userService.updateUserById(userId, userData);
  }
}
