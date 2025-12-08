import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PresignedUrlDto {
  @ApiProperty({ description: '파일 이름' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: '파일 MIME 타입' })
  @IsString()
  contentType: string;

  @ApiPropertyOptional({
    description: 'S3 업로드 폴더 경로',
    default: 'images',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class PresignedUrlResponseDto {
  @ApiProperty({ description: '파일 업로드를 위한 Presigned URL' })
  @IsString()
  uploadUrl: string;

  @ApiProperty({ description: '업로드된 파일의 접근 URL' })
  @IsString()
  fileUrl: string;
}
