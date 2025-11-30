import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtAccessAuthGuard, JwtRefreshAuthGuard } from './guards/jwt.guard';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { TokenPair } from './types/token.type';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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
    const tokenPair = await this.authService.login(
      loginDto.provider,
      loginDto.token,
    );

    return ResponseDto.ok<LoginResponseDto>(tokenPair);
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
    const tokenPair = await this.authService.register(
      registerDto.provider,
      registerDto.token,
      registerDto.username,
      registerDto.role,
    );

    return ResponseDto.ok<LoginResponseDto>(tokenPair);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async refresh(@Req() req: Request) {
    const tokenPair = await this.tokenService.refreshTokenPair(
      req.user,
      req.token,
    );

    return ResponseDto.ok<TokenPair>(tokenPair);
  }

  @Post('logout')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃 (현재 세션)' })
  @ApiResponse({ status: 204, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async logout(@Req() req: Request) {
    await this.tokenService.revokeToken('access', req.token);

    return ResponseDto.noContent();
  }

  @Post('logout-all')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 세션에서 로그아웃' })
  @ApiResponse({ status: 204, description: '모든 세션 로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async logoutAll(@Req() req: Request) {
    await this.tokenService.revokeAllRefreshTokens(req.user);

    return ResponseDto.noContent();
  }
}
