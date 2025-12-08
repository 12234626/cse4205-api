import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from 'src/config/jwt.config';
import { TokenEntity } from 'src/auth/entities/token.entity';
import { Payload } from 'src/auth/types/token.type';
import { TokenType, TokenPair } from 'src/auth/types/token.type';
import { UserEntity } from 'src/user/entities/user.entity';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {
    this.jwtConfig = this.configService.getOrThrow<JwtConfig>('jwt');
  }

  generateToken(payload: Payload, secret: string, expiresIn: number): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: `${expiresIn}s`,
    });
  }

  generateTokenPair(payload: Payload): TokenPair {
    const { sub, role } = payload;
    const newPayload: Payload = {
      sub,
      role,
    };

    const accessToken = this.generateToken(
      newPayload,
      this.jwtConfig.secret.access,
      this.jwtConfig.expiresIn.access,
    );
    const refreshToken = this.generateToken(
      newPayload,
      this.jwtConfig.secret.refresh,
      this.jwtConfig.expiresIn.refresh,
    );

    return { accessToken, refreshToken };
  }

  async verifyToken(tokenString: string, type: TokenType): Promise<boolean> {
    try {
      const secret =
        type === 'access'
          ? this.jwtConfig.secret.access
          : this.jwtConfig.secret.refresh;

      this.jwtService.verify<Payload>(tokenString, { secret });

      const where =
        type === 'access'
          ? { accessToken: tokenString }
          : { refreshToken: tokenString };
      const token = await this.tokenRepository.findOne({
        where,
      });

      return Boolean(token);
    } catch {
      return false;
    }
  }

  async saveTokenPair(
    user: UserEntity,
    tokenPair: TokenPair,
  ): Promise<TokenEntity> {
    const token = this.tokenRepository.create({
      ...tokenPair,
      user,
    });

    return await this.tokenRepository.save(token);
  }

  async refreshTokenPair(
    user: UserEntity,
    refreshToken: string,
  ): Promise<TokenPair> {
    const isValid = await this.verifyToken(refreshToken, 'refresh');

    if (!isValid) {
      throw ResponseException.unauthorized();
    }

    const payload: Payload = {
      sub: user.userId,
      role: user.role,
    };

    const tokenPair = this.generateTokenPair(payload);

    await this.revokeToken('refresh', refreshToken);
    await this.saveTokenPair(user, tokenPair);

    return tokenPair;
  }

  async revokeToken(type: TokenType, tokenString: string): Promise<void> {
    await this.tokenRepository.delete({
      [type === 'access' ? 'accessToken' : 'refreshToken']: tokenString,
    });
  }

  async revokeAllRefreshTokens(user: UserEntity): Promise<void> {
    await this.tokenRepository.delete({ user: { userId: user.userId } });
  }
}
