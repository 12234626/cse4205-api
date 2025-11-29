import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'OAuth 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({
    status: 400,
    description: '잘못된 토큰 (INVALID_TOKEN) / 검증 오류 (VALIDATION_ERROR)',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (USER_NOT_FOUND)',
  })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(
      loginDto.provider,
      loginDto.token,
    );

    return ResponseDto.ok<LoginResponseDto>({ token });
  }

  @Post('register')
  @ApiOperation({ summary: 'OAuth 회원가입' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  @ApiResponse({
    status: 400,
    description: '잘못된 토큰 (INVALID_TOKEN) / 검증 오류 (VALIDATION_ERROR)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 존재하는 사용자 (USER_ALREADY_EXISTS)',
  })
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
