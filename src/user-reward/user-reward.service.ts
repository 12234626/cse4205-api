import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/user-reward.dto';
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

  async findAll(): Promise<UserRewardEntity[]> {
    return this.userRewardRepository.find();
  }

  async findOne(id: number): Promise<UserRewardEntity | null> {
    const userReward = await this.userRewardRepository.findOne({
      where: { userRewardId: id },
    });

    return userReward;
  }

  async create(
    createUserRewardDto: CreateUserRewardDto,
  ): Promise<UserRewardEntity> {
    const user = await this.userService.findOne(createUserRewardDto.userId);

    if (!user) {
      throw ResponseException.userNotFound();
    }

    const reward = await this.rewardService.findOne(
      createUserRewardDto.rewardId,
    );

    if (!reward) {
      throw ResponseException.rewardNotFound();
    }

    const userReward = this.userRewardRepository.create({
      user,
      reward,
    });

    return this.userRewardRepository.save(userReward);
  }

  async softRemove(id: number): Promise<void> {
    const userReward = await this.findOne(id);

    if (!userReward) {
      throw ResponseException.userRewardNotFound();
    }

    await this.userRewardRepository.softRemove(userReward);
  }
}
