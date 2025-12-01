import {
  Controller,
  UseGuards,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserRewardService } from './user-reward.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRewardEntity } from './entities/user-reward.entity';
import { CreateUserRewardDto } from './dtos/user-reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiBearerAuth()
@ApiTags('사용자 보상')
@Controller('user-reward')
@UseGuards(JwtAccessAuthGuard)
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get()
  @ApiOperation({ summary: '전체 사용자 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 보상 조회 성공',
    type: [UserRewardEntity],
  })
  async findAll() {
    const userRewards = await this.userRewardService.findAll();

    return ResponseDto.ok<UserRewardEntity[]>(userRewards);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 사용자 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 보상 조회 성공',
    type: UserRewardEntity,
  })
  @ApiResponse({
    status: 404,
    description: '사용자 보상을 찾을 수 없음 (USER_REWARD_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const userReward = await this.userRewardService.findOne(id);

    if (!userReward) {
      throw ResponseException.userRewardNotFound();
    }

    return ResponseDto.ok<UserRewardEntity>(userReward);
  }

  @Post()
  @ApiOperation({ summary: '새 사용자 보상 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 보상 생성 성공',
    type: UserRewardEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createUserRewardDto: CreateUserRewardDto) {
    const userReward = await this.userRewardService.create(createUserRewardDto);

    return ResponseDto.created<UserRewardEntity>(userReward);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 보상 삭제' })
  @ApiResponse({ status: 204, description: '사용자 보상 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '사용자 보상을 찾을 수 없음 (USER_REWARD_NOT_FOUND)',
  })
  async softDelete(@Param('id') id: number) {
    await this.userRewardService.softDelete(id);

    return ResponseDto.noContent();
  }
}
