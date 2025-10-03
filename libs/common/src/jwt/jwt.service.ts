import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IPayload } from './interfaces/payload.interface';
import { ObjectId } from 'typeorm';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: IPayload): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async generateRefreshToken(userId: ObjectId): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id: userId, type: 'refresh' },
      { expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') },
    );
    return refreshToken;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  decodeToken(token: string): IPayload {
    const decode = this.jwtService.decode(token);
    if (!decode) throw new Error('Failed to decode token');
    return decode as IPayload;
  }
}
