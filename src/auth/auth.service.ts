import { UserEntity } from '@app/common/database/entities/user.entity';
import { JwtService } from '@app/common/jwt/jwt.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDataDTO } from './dtos/register.dto';
import { IPayload } from '@app/common/jwt/interfaces/payload.interface';
import { LoginDTO } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDataDTO): Promise<any> {
    try {
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
    } catch (error) {
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginData: LoginDTO): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({
        email: loginData.email,
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

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
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException('Login failed');
    }
  }
}
