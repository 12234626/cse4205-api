import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { Provider } from 'src/user/types/provider.type';
import { UserRole } from 'src/user/types/user-role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async findByProviderId(
    provider: Provider,
    providerId: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { provider, providerId },
    });
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

  async softDelete(user: UserEntity): Promise<void> {
    await this.userRepository.softDelete(user.userId);
  }
}
