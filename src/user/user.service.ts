import { UserEntity } from '@app/common/database/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllUser(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    if (!users) throw new NotFoundException('Users not found');
    return users;
  }

  async findOneUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      _id: new ObjectId(userId),
    } as any);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (user) throw new BadRequestException('Email already exists');
    user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return user;
  }

  async updateUserById(userId: string, userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
        _id: new ObjectId(userId)
    } as any);

    if(!user) throw new NotFoundException('User not found');

    if(userData.email && userData.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email }
        });
        if (existingUser) throw new BadRequestException('Email already exists');
    }

    Object.assign(user, userData);
    await this.userRepository.save(user);

    return user;
  }
}
