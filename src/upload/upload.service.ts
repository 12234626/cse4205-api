import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AwsConfig } from 'src/config/aws.config';
import { PresignedUrlResponseDto } from 'src/upload/dtos/presigned-url.dto';
import { SaveFileUrlDto, FileUploadType } from './dtos/save-file-url.dto';
import { UserService } from 'src/user/services/user.service';
import { ResponseException } from 'src/common/exceptions/response.exception';
import { ConsentRequestImageEntity } from 'src/consent-request/entities/consent-request-image.entity';

@Injectable()
export class UploadService {
  private readonly awsConfig: AwsConfig;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ConsentRequestImageEntity)
    private readonly consentRequestImageRepository: Repository<ConsentRequestImageEntity>,
    private readonly userService: UserService,
  ) {
    this.awsConfig = this.configService.getOrThrow<AwsConfig>('aws');
    this.s3Client = new S3Client({ region: this.awsConfig.region });
  }

  async PresignedUrl(
    fileName: string,
    contentType: string,
    folder: string = 'images',
  ): Promise<PresignedUrlResponseDto> {
    const key = `${folder}/${new Date().toISOString().split('T')[0]}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.awsConfig.s3BucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    const fileUrl = `https://${this.awsConfig.s3BucketName}.s3.${this.awsConfig.region}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }

  async saveFileUrl(userId: number, dto: SaveFileUrlDto): Promise<void> {
    const user = await this.userService.findOne({
      where: { userId },
    });

    if (!user) {
      throw ResponseException.userNotFound();
    }

    if (dto.fileType === FileUploadType.AVATAR) {
      // 아바타 이미지 업데이트
      user.avatarUrl = dto.fileUrl;
      await this.userService.save(user);
    } else if (dto.fileType === FileUploadType.CONSENT_IMAGE) {
      // 퀘스트 검증 이미지 저장
      if (!dto.consentRequestId) {
        throw ResponseException.validationError();
      }

      const consentImage = this.consentRequestImageRepository.create({
        consentRequest: { consentRequestId: dto.consentRequestId },
        imageUrl: dto.fileUrl,
      });

      await this.consentRequestImageRepository.save(consentImage);
    }
  }
}
