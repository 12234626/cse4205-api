import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsEnum } from 'class-validator';

export enum FileUploadType {
  AVATAR = 'avatar',
  CONSENT_IMAGE = 'consent_image',
}

export class SaveFileUrlDto {
  @ApiProperty({ description: '업로드된 파일 URL' })
  @IsUrl()
  fileUrl: string;

  @ApiProperty({
    enum: FileUploadType,
    description:
      '파일 타입 (avatar: 아바타, consent_image: 퀘스트 검증 이미지)',
  })
  @IsEnum(FileUploadType)
  fileType: FileUploadType;

  @ApiProperty({
    description: '퀘스트 검증 이미지인 경우 consent request ID (필수)',
    required: false,
  })
  @IsString()
  consentRequestId?: number;
}
