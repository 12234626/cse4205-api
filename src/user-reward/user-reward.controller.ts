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
  ApiParam,
} from '@nestjs/swagger';

import { UserRewardService } from './user-reward.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRewardDto } from './dtos/user-reward.dto';
import { CreateUserRewardDto } from './dtos/create-user-reward.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('사용자 보상')
@Controller('user-reward')
export class UserRewardController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '전체 사용자 보상 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 보상 목록 조회 성공',
    type: [UserRewardDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll() {
    const userRewards = await this.userRewardService.findAll();

    return ResponseDto.ok<UserRewardDto[]>(
      userRewards.map((userReward) => new UserRewardDto(userReward)),
    );
  }

  @Get(':userRewardId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID로 사용자 보상 조회' })
  @ApiParam({ name: 'userRewardId', description: '사용자 보상 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 보상 조회 성공',
    type: UserRewardDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 보상을 찾을 수 없음 (USER_REWARD_NOT_FOUND)',
  })
  async findOne(@Param('userRewardId') userRewardId: number) {
    const userReward = await this.userRewardService.findOne({
      where: { userRewardId },
    });

    if (!userReward) {
      throw ResponseException.userRewardNotFound();
    }

    return ResponseDto.ok<UserRewardDto>(new UserRewardDto(userReward));
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 사용자 보상 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 보상 생성 성공',
    type: UserRewardDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async create(@Body() createUserRewardDto: CreateUserRewardDto) {
    const userReward = await this.userRewardService.create(createUserRewardDto);

    return ResponseDto.created<UserRewardDto>(userReward);
  }

  @Delete(':userRewardId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 보상 삭제' })
  @ApiParam({ name: 'userRewardId', description: '사용자 보상 ID' })
  @ApiResponse({ status: 204, description: '사용자 보상 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자 보상을 찾을 수 없음 (USER_REWARD_NOT_FOUND)',
  })
  async softRemove(@Param('userRewardId') userRewardId: number) {
    await this.userRewardService.softRemove(userRewardId);

    return ResponseDto.noContent();
  }
}
