import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@app/common/database/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAllUser(): Promise<any> {
    return this.userService.findAllUser();
  }

  @Post('create')
  async createUser(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.createUser(userData);
  }
}
