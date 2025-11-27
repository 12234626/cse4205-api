import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from 'src/auth/dtos/login.dto';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(
      loginDto.provider,
      loginDto.token,
    );

    return ResponseDto.ok<LoginResponseDto>({ token });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const token = await this.authService.register(
      registerDto.provider,
      registerDto.token,
      registerDto.username,
      registerDto.role,
    );

    return ResponseDto.ok<LoginResponseDto>({ token });
  }
}
