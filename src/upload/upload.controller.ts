import { Controller, UseGuards, Post, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { UploadService } from './upload.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  PresignedUrlDto,
  PresignedUrlResponseDto,
} from './dtos/presigned-url.dto';
import { SaveFileUrlDto } from './dtos/save-file-url.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('업로드')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'S3 업로드를 위한 Presigned URL 생성' })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL 생성 성공',
    type: PresignedUrlResponseDto,
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async PresignedUrl(@Body() dto: PresignedUrlDto) {
    return ResponseDto.ok<PresignedUrlResponseDto>(
      await this.uploadService.PresignedUrl(
        dto.fileName,
        dto.contentType,
        dto.folder,
      ),
    );
  }

  @Post('save-file')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: '업로드된 파일 URL을 저장 (아바타 또는 퀘스트 검증 이미지)',
  })
  @ApiResponse({
    status: 204,
    description: '파일 URL 저장 성공',
  })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (NOT_FOUND)',
  })
  async saveFileUrl(@Req() req: Request, @Body() dto: SaveFileUrlDto) {
    await this.uploadService.saveFileUrl(req.user.userId, dto);
    return ResponseDto.noContent();
  }
}
