import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AwsConfig } from 'src/config/aws.config';
import { PresignedUrlResponseDto } from 'src/upload/dtos/presigned-url.dto';

@Injectable()
export class UploadService {
  private readonly awsConfig: AwsConfig;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
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
}
