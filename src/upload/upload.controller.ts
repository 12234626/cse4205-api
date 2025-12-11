import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Query,
} from '@nestjs/common';
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
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: 'S3 업로드를 위한 Presigned URL 생성',
  })
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
    summary: '업로드된 파일 URL을 데이터베이스에 저장',
  })
  @ApiResponse({
    status: 204,
    description: '파일 URL 저장 성공',
  })
  @ApiResponse({
    status: 400,
    description:
      '검증 오류 (VALIDATION_ERROR) - CONSENT_IMAGE 타입인데 consentRequestId가 없는 경우',
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음 (NOT_FOUND)',
  })
  async saveFileUrl(@Req() req: Request, @Body() dto: SaveFileUrlDto) {
    await this.uploadService.saveFileUrl(req.user.userId, dto);
    return ResponseDto.noContent();
  }

  @Get('presigned-get-url')
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @ApiOperation({
    summary: 'S3 파일 조회를 위한 Presigned GET URL 생성',
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned GET URL 생성 성공',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패 (UNAUTHORIZED)' })
  async getPresignedGetUrl(@Query('fileUrl') fileUrl: string) {
    const url = await this.uploadService.getPresignedGetUrl(fileUrl);
    return ResponseDto.ok({ url });
  }
}
