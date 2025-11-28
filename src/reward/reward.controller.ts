import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { RewardService } from 'src/reward/reward.service';
import { CreateRewardDto, UpdateRewardDto } from 'src/reward/dtos/reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  async findAll() {
    const rewards = await this.rewardService.findAll();
    return ResponseDto.ok(rewards);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const reward = await this.rewardService.findOne(id);
    return ResponseDto.ok(reward);
  }

  @Post()
  async create(@Body() createRewardDto: CreateRewardDto) {
    const reward = await this.rewardService.create(createRewardDto);
    return ResponseDto.created(reward);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    const reward = await this.rewardService.update(id, updateRewardDto);
    return ResponseDto.ok(reward);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rewardService.remove(id);
    return ResponseDto.noContent();
  }
}
