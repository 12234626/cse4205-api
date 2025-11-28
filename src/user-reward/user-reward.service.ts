import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRewardEntity } from 'src/user-reward/entities/user-reward.entity';
import { CreateUserRewardDto } from 'src/user-reward/dtos/user-reward.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ErrorCode } from 'src/common/types/error-code.type';

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
      throw new ResponseException(ErrorCode.NOT_FOUND, 'UserReward not found');
    }

    return userReward;
  }

  async create(
    createUserRewardDto: CreateUserRewardDto,
  ): Promise<UserRewardEntity> {
    const userReward = this.userRewardRepository.create(createUserRewardDto);
    return this.userRewardRepository.save(userReward);
  }

  async remove(id: number): Promise<void> {
    const userReward = await this.findOne(id);
    await this.userRewardRepository.remove(userReward);
  }
}
