import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  PresignedUrlDto,
  PresignedUrlResponseDto,
} from './dtos/presigned-url.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@ApiTags('업로드')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAccessAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'S3 업로드를 위한 Presigned URL 생성' })
  @ApiResponse({ status: 200, description: 'Presigned URL 생성 성공' })
  @ApiResponse({ status: 400, description: '검증 오류 (VALIDATION_ERROR)' })
  async PresignedUrl(@Body() dto: PresignedUrlDto) {
    return ResponseDto.ok<PresignedUrlResponseDto>(
      await this.uploadService.PresignedUrl(
        dto.fileName,
        dto.contentType,
        dto.folder,
      ),
    );
  }
}
