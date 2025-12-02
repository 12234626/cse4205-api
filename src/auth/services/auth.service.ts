import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/user/services/user.service';
import { TokenService } from './token.service';
import { JwtConfig } from 'src/config/jwt.config';
import {
  GoogleResponseDto,
  NaverResponseDto,
  KakaoResponseDto,
  ProviderResponse,
} from 'src/auth/dtos/provider-response.dto';
import { Payload } from 'src/auth/types/token.type';
import { TokenPair } from 'src/auth/types/token.type';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {
    this.jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');
  }

  private getAuthUrl(provider: Provider): string {
    switch (provider) {
      case Provider.GOOGLE:
        return 'https://www.googleapis.com/oauth2/v2/userinfo';

      case Provider.NAVER:
        return 'https://openapi.naver.com/v1/nid/me';

      case Provider.KAKAO:
        return 'https://kapi.kakao.com/v2/user/me';

      default:
        throw ResponseException.invalidProvider();
    }
  }

  private normalizeProviderResponse(
    provider: Provider,
    data: unknown,
  ): ProviderResponse {
    switch (provider) {
      case Provider.GOOGLE: {
        const googleData = data as GoogleResponseDto;

        return {
          id: googleData.id,
          nickname: googleData.name,
          picture: googleData.picture,
        };
      }

      case Provider.NAVER: {
        const naverData = data as NaverResponseDto;

        return {
          id: naverData.response.id,
          nickname: naverData.response.nickname,
          picture: naverData.response.profile_image,
        };
      }

      case Provider.KAKAO: {
        const kakaoData = data as KakaoResponseDto;

        return {
          id: kakaoData.id,
          nickname: kakaoData.properties.nickname,
          picture: kakaoData.properties.profile_image,
        };
      }

      default:
        throw ResponseException.invalidProvider();
    }
  }

  async fetchProviderId(
    provider: Provider,
    token: string,
  ): Promise<ProviderResponse> {
    const url = this.getAuthUrl(provider);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw ResponseException.invalidToken();
    }

    const data = (await response.json()) as
      | GoogleResponseDto
      | NaverResponseDto
      | KakaoResponseDto;
    const providerResponse: ProviderResponse = this.normalizeProviderResponse(
      provider,
      data,
    );

    return providerResponse;
  }

  async login(provider: Provider, token: string): Promise<TokenPair> {
    const providerResponse = await this.fetchProviderId(provider, token);
    const user = await this.userService.findByProviderId(
      provider,
      providerResponse.id,
    );

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const payload: Payload = {
      sub: user.userId,
      role: user.role,
    };
    const tokenPair = this.tokenService.generateTokenPair(payload);

    await this.tokenService.saveTokenPair(user, tokenPair);

    return tokenPair;
  }

  async register(
    provider: Provider,
    token: string,
    username: string,
    role: UserRole,
  ): Promise<TokenPair> {
    const providerResponse = await this.fetchProviderId(provider, token);
    const existingUser = await this.userService.findByProviderId(
      provider,
      providerResponse.id,
    );

    if (existingUser) {
      throw ResponseException.userAlreadyExists();
    }

    const user = await this.userService.create({
      provider,
      providerId: providerResponse.id,
      username,
      role,
    });
    const payload: Payload = {
      sub: user.userId,
      role: user.role,
    };
    const tokenPair = this.tokenService.generateTokenPair(payload);

    await this.tokenService.saveTokenPair(user, tokenPair);

    return tokenPair;
  }
}
