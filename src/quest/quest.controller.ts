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

import { QuestService } from './quest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { QuestEntity } from './entities/quest.entity';
import { CreateQuestDto, UpdateQuestDto } from './dtos/quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('quest')
@UseGuards(JwtAuthGuard)
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    if (title) {
      const quests = await this.questService.searchByTitle(title);

      return ResponseDto.ok<QuestEntity[]>(quests);
    }

    if (category) {
      const quests = await this.questService.findByCategory(category);

      return ResponseDto.ok<QuestEntity[]>(quests);
    }

    const quests = await this.questService.findAll();

    return ResponseDto.ok<QuestEntity[]>(quests);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const quest = await this.questService.findOne(id);

    return ResponseDto.ok<QuestEntity>(quest);
  }

  @Post()
  async create(@Body() createQuestDto: CreateQuestDto) {
    const quest = await this.questService.create(createQuestDto);

    return ResponseDto.created<QuestEntity>(quest);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    const quest = await this.questService.update(id, updateQuestDto);

    return ResponseDto.ok<QuestEntity>(quest);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    await this.questService.softDelete(id);

    return ResponseDto.noContent();
  }
}
