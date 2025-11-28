import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { UserQuestService } from 'src/user-quest/user-quest.service';
import {
  CreateUserQuestDto,
  UpdateUserQuestDto,
} from 'src/user-quest/dtos/user-quest.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('user-quest')
export class UserQuestController {
  constructor(private readonly userQuestService: UserQuestService) {}

  @Get()
  async findAll() {
    const userQuests = await this.userQuestService.findAll();
    return ResponseDto.ok(userQuests);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userQuest = await this.userQuestService.findOne(id);
    return ResponseDto.ok(userQuest);
  }

  @Post()
  async create(@Body() createUserQuestDto: CreateUserQuestDto) {
    const userQuest = await this.userQuestService.create(createUserQuestDto);
    return ResponseDto.created(userQuest);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserQuestDto: UpdateUserQuestDto,
  ) {
    const userQuest = await this.userQuestService.update(
      id,
      updateUserQuestDto,
    );
    return ResponseDto.ok(userQuest);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userQuestService.remove(id);
    return ResponseDto.noContent();
  }
}
