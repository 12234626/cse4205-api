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

import { VerificationService } from './verification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { VerificationEntity } from './entities/verification.entity';
import {
  CreateVerificationDto,
  UpdateVerificationDto,
} from './dtos/verification.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('verification')
@UseGuards(JwtAuthGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  async findAll() {
    const verifications = await this.verificationService.findAll();

    return ResponseDto.ok<VerificationEntity[]>(verifications);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const verification = await this.verificationService.findOne(id);

    return ResponseDto.ok<VerificationEntity>(verification);
  }

  @Post()
  async create(@Body() createVerificationDto: CreateVerificationDto) {
    const verification = await this.verificationService.create(
      createVerificationDto,
    );

    return ResponseDto.created<VerificationEntity>(verification);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    const verification = await this.verificationService.update(
      id,
      updateVerificationDto,
    );
    return ResponseDto.ok<VerificationEntity>(verification);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    await this.verificationService.softDelete(id);

    return ResponseDto.noContent();
  }
}
