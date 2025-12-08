import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';

import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/create-user-reward.dto';
import { UserService } from 'src/user/services/user.service';
import { RewardService } from 'src/reward/reward.service';
import { ResponseException } from 'src/common/exceptions/response.exception';

@Injectable()
export class UserRewardService {
  constructor(
    @InjectRepository(UserRewardEntity)
    private readonly userRewardRepository: Repository<UserRewardEntity>,
    private readonly userService: UserService,
    private readonly rewardService: RewardService,
  ) {}

  async findAll(
    options?: FindManyOptions<UserRewardEntity>,
  ): Promise<UserRewardEntity[]> {
    return this.userRewardRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<UserRewardEntity>,
  ): Promise<UserRewardEntity | null> {
    return this.userRewardRepository.findOne(options);
  }

  async create(
    createUserRewardDto: CreateUserRewardDto,
  ): Promise<UserRewardEntity> {
    const user = await this.userService.findOne({
      where: { userId: createUserRewardDto.userId },
    });

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const reward = await this.rewardService.findOne({
      where: { rewardId: createUserRewardDto.rewardId },
    });

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    const userReward = this.userRewardRepository.create({
      user,
      reward,
    });

    return this.userRewardRepository.save(userReward);
  }

  async softRemove(userRewardId: number): Promise<void> {
    const userReward = await this.findOne({
      where: { userRewardId },
    });

    if (!userReward) {
      throw ResponseException.userRewardNotFound();
    }

    await this.userRewardRepository.softRemove(userReward);
  }
}
