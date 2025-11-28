import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { UserRewardService } from 'src/user-reward/user-reward.service';
import { CreateUserRewardDto } from 'src/user-reward/dtos/user-reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get()
  async findAll() {
    const userRewards = await this.userRewardService.findAll();
    return ResponseDto.ok(userRewards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const userReward = await this.userRewardService.findOne(id);
    return ResponseDto.ok(userReward);
  }

  @Post()
  async create(@Body() createUserRewardDto: CreateUserRewardDto) {
    const userReward = await this.userRewardService.create(createUserRewardDto);
    return ResponseDto.created(userReward);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userRewardService.remove(id);
    return ResponseDto.noContent();
  }
}
