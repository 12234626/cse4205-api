import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Like } from 'typeorm';

import { QuestService } from './quest.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import { QuestDto } from './dtos/quest.dto';
import { CreateQuestDto } from './dtos/create-quest.dto';
import { UpdateQuestDto } from './dtos/update-quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ResponseException } from 'src/common/exceptions/response.exception';

@ApiTags('퀘스트')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '전체 퀘스트 조회 또는 제목/카테고리로 검색' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: '퀘스트 제목 검색어',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '퀘스트 카테고리',
  })
  @ApiResponse({
    status: 200,
    description: '퀘스트 조회 성공',
    type: [QuestDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    const quests = await this.questService.findAll({
      where: {
        title: title ? Like(`%${title}%`) : undefined,
        category: category ? category : undefined,
      },
    });

    return ResponseDto.ok<QuestDto[]>(
      quests.map((quest) => new QuestDto(quest)),
    );
  }

  @Get(':questId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID로 퀘스트 조회' })
  @ApiResponse({
    status: 200,
    description: '퀘스트 조회 성공',
    type: QuestDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async findOne(@Param('questId') questId: number) {
    const quest = await this.questService.findOne({
      where: { questId },
    });

    if (!quest) {
      throw ResponseException.questNotFound();
    }

    return ResponseDto.ok<QuestDto>(new QuestDto(quest));
  }

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 퀘스트 생성' })
  @ApiResponse({
    status: 201,
    description: '퀘스트 생성 성공',
    type: QuestDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async create(@Body() createQuestDto: CreateQuestDto) {
    const quest = await this.questService.create(createQuestDto);

    return ResponseDto.created<QuestDto>(new QuestDto(quest));
  }

  @Put(':questId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '퀘스트 수정' })
  @ApiResponse({
    status: 200,
    description: '퀘스트 수정 성공',
    type: QuestDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async update(
    @Param('questId') questId: number,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    const quest = await this.questService.update(questId, updateQuestDto);

    return ResponseDto.ok<QuestDto>(new QuestDto(quest));
  }

  @Delete(':questId')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '퀘스트 삭제' })
  @ApiResponse({ status: 204, description: '퀘스트 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '퀘스트를 찾을 수 없음 (QUEST_NOT_FOUND)',
  })
  async softRemove(@Param('questId') questId: number) {
    await this.questService.softRemove(questId);

    return ResponseDto.noContent();
  }
}
