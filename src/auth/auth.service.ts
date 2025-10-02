import { UserEntity } from '@app/common/database/entities/user.entity';
import { JwtService } from '@app/common/jwt/jwt.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDataDTO } from './dtos/register.dto';
import { IPayload } from '@app/common/jwt/interfaces/payload.interface';
import { LoginDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDataDTO): Promise<any> {
    let user = await this.userRepository.findOneBy({
      email: registerData.email,
    });
    if (user) throw new BadRequestException('User is already created!');

    user = this.userRepository.create(registerData);
    await this.userRepository.save(user);

    const payload: IPayload = {
      id: user.id,
      username: user.username,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken(payload),
      this.jwtService.generateRefreshToken(user.id),
    ]);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  
  async login(loginData: LoginDTO) {
    try {

    } catch (error) {

    }
  }
}
