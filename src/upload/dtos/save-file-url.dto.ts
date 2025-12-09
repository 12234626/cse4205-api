import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUrl, IsEnum, IsOptional } from 'class-validator';

import { FileUploadType } from '../types/file-upload.type';

export class SaveFileUrlDto {
  @ApiProperty({
    description: '업로드된 파일 URL',
  })
  @IsUrl()
  fileUrl: string;

  @ApiProperty({
    enum: FileUploadType,
    description: '파일 타입',
    enumName: 'FileUploadType',
  })
  @IsEnum(FileUploadType)
  fileType: FileUploadType;

  @ApiProperty({
    description:
      '퀘스트 검증 이미지인 경우 consent request ID (CONSENT_IMAGE 타입일 때 필수)',
    required: false,
  })
  @IsInt()
  @IsOptional()
  consentRequestId?: number;
}
