import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { Provider } from './types/provider.type';
import { UserRole } from './types/user-role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    return user;
  }

  async findByProviderId(
    provider: Provider,
    providerId: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { provider, providerId },
    });

    return user;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    return user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);

    return Boolean(user);
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
