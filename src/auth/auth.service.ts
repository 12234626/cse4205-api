import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { JwtConfig } from 'src/config/jwt.config';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProviderResponseDto } from 'src/auth/dtos/provider-response.dto';
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

  async fetchProviderId(provider: Provider, token: string): Promise<string> {
    const url = this.getAuthUrl(provider);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw ResponseException.invalidToken();
    }

    const { id } = (await response.json()) as ProviderResponseDto;

    return id;
  }

  async login(provider: Provider, token: string): Promise<string> {
    const providerId = await this.fetchProviderId(provider, token);
    const user = await this.userService.findByProviderId(provider, providerId);

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
    accessToken: string,
    username: string,
    role: UserRole,
  ): Promise<string> {
    const providerId = await this.fetchProviderId(provider, accessToken);
    const existingUser = await this.userService.findByProviderId(
      provider,
      providerId,
    );

    if (existingUser) {
      if (existingUser.deletedAt) {
        throw ResponseException.userDeleted();
      }
      throw ResponseException.userAlreadyExists();
    }

    const user = await this.userService.create({
      provider,
      providerId,
      username,
      role,
    });

    return this.generateToken(user);
  }
}
