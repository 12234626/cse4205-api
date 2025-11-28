import {
  Controller,
  UseGuards,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { UserRewardService } from './user-reward.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/user-reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('user-reward')
@UseGuards(JwtAuthGuard)
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get()
  async findAll() {
    const userRewards = await this.userRewardService.findAll();

    return ResponseDto.ok<UserRewardEntity[]>(userRewards);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const userReward = await this.userRewardService.findOne(id);

    return ResponseDto.ok<UserRewardEntity>(userReward);
  }

  @Post()
  async create(@Body() createUserRewardDto: CreateUserRewardDto) {
    const userReward = await this.userRewardService.create(createUserRewardDto);

    return ResponseDto.created<UserRewardEntity>(userReward);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    await this.userRewardService.softDelete(id);

    return ResponseDto.noContent();
  }
}
