import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDataDTO } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDataDTO): Promise<any> {
    return this.authService.register(registerData);
  }

  @Post('login')
  async login() {
    
  }
}
