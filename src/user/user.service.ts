import { UserEntity } from '@app/common/database/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async findAllUser() {
        return this.userRepository.find()
    }

    async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
        let user = await this.userRepository.findOne({ where: { email: userData.email } });
        if(user) 
            throw new BadRequestException('Email already exists');
        user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        return user;
    }
}
