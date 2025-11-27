import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { JwtConfig } from 'src/config/jwt.config';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  GoogleResponseDto,
  NaverResponseDto,
  KakaoResponseDto,
  ProviderResponse,
} from 'src/auth/dtos/provider-response.dto';
import { Payload } from 'src/auth/types/payload.type';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');
  }

  private generateToken(user: UserEntity): string {
    const payload: Payload = {
      sub: user.userId,
      provider: user.provider,
      providerId: user.providerId,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
    });
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

    const data: unknown = await response.json();
    const providerResponse: ProviderResponse = this.normalizeProviderResponse(
      provider,
      data,
    );

    return providerResponse;
  }

  async login(provider: Provider, token: string): Promise<string> {
    const providerResponse = await this.fetchProviderId(provider, token);
    const user = await this.userService.findByProviderId(
      provider,
      providerResponse.id,
    );

    if (!user) {
      throw ResponseException.userNotFound();
    }
    if (user.deletedAt) {
      throw ResponseException.userDeleted();
    }

    return this.generateToken(user);
  }

  async register(
    provider: Provider,
    token: string,
    username: string,
    role: UserRole,
  ): Promise<string> {
    const providerResponse = await this.fetchProviderId(provider, token);
    const existingUser = await this.userService.findByProviderId(
      provider,
      providerResponse.id,
    );

    if (existingUser) {
      if (existingUser.deletedAt) {
        throw ResponseException.userDeleted();
      }
      throw ResponseException.userAlreadyExists();
    }

    const user = await this.userService.create({
      provider,
      providerId: providerResponse.id,
      username,
      role,
    });

    return this.generateToken(user);
  }
}
