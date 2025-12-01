import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
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

import { UserQuestService } from './user-quest.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserQuestEntity } from './entities/user-quest.entity';
import { CreateUserQuestDto, UpdateUserQuestDto } from './dtos/user-quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiBearerAuth()
@ApiTags('사용자 퀘스트')
@Controller('user-quest')
@UseGuards(JwtAccessAuthGuard)
export class UserQuestController {
  constructor(private readonly userQuestService: UserQuestService) {}

  @Get()
  @ApiOperation({ summary: '전체 사용자 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 조회 성공',
    type: [UserQuestEntity],
  })
  async findAll() {
    const userQuests = await this.userQuestService.findAll();

    return ResponseDto.ok<UserQuestEntity[]>(userQuests);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 사용자 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 조회 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async findOne(@Param('id') id: number) {
    const userQuest = await this.userQuestService.findOne(id);

    if (!userQuest) {
      throw ResponseException.userQuestNotFound();
    }

    return ResponseDto.ok<UserQuestEntity>(userQuest);
  }

  @Post()
  @ApiOperation({ summary: '새 사용자 퀘스트 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 퀘스트 생성 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async create(@Body() createUserQuestDto: CreateUserQuestDto) {
    const userQuest = await this.userQuestService.create(createUserQuestDto);

    return ResponseDto.created<UserQuestEntity>(userQuest);
  }

  @Put(':id')
  @ApiOperation({ summary: '사용자 퀘스트 수정' })
  @ApiResponse({
    status: 200,
    description: '사용자 퀘스트 수정 성공',
    type: UserQuestEntity,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateUserQuestDto: UpdateUserQuestDto,
  ) {
    const userQuest = await this.userQuestService.update(
      id,
      updateUserQuestDto,
    );

    return ResponseDto.ok<UserQuestEntity>(userQuest);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 퀘스트 삭제' })
  @ApiResponse({ status: 204, description: '사용자 퀘스트 삭제 성공' })
  @ApiResponse({
    status: 404,
    description: '사용자 퀘스트를 찾을 수 없음 (USER_QUEST_NOT_FOUND)',
  })
  async softDelete(@Param('id') id: number) {
    await this.userQuestService.softDelete(id);

    return ResponseDto.noContent();
  }
}
