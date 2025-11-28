import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { Provider } from './types/provider.type';
import { UserRole } from './types/user-role.type';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw ResponseException.userNotFound();
    }

    return user;
  }

  async findByProviderId(
    provider: Provider,
    providerId: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { provider, providerId },
    });

    if (!user) {
      throw ResponseException.userNotFound();
    }

    return user;
  }

  async create(data: {
    provider: Provider;
    providerId: string;
    username: string;
    role: UserRole;
  }): Promise<UserEntity> {
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }

  async softDelete(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
