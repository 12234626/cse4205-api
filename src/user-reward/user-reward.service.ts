import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/user-reward.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class UserRewardService {
  constructor(
    @InjectRepository(UserRewardEntity)
    private readonly userRewardRepository: Repository<UserRewardEntity>,
  ) {}

  async findAll(): Promise<UserRewardEntity[]> {
    return this.userRewardRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserRewardEntity> {
    const userReward = await this.userRewardRepository.findOne({
      where: { userRewardId: id },
    });

    if (!userReward) {
      throw ResponseException.userRewardNotFound();
    }

    return userReward;
  }

  async create(
    createUserRewardDto: CreateUserRewardDto,
  ): Promise<UserRewardEntity> {
    const userReward = this.userRewardRepository.create(createUserRewardDto);

    return this.userRewardRepository.save(userReward);
  }

  async softDelete(id: number): Promise<void> {
    await this.userRewardRepository.softDelete(id);
  }
}
