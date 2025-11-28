import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AwsConfig } from 'src/config/aws.config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.getOrThrow<AwsConfig>('aws');

    this.s3Client = new S3Client({
      region: awsConfig.region,
    });

    this.bucketName = awsConfig.s3BucketName;
  }

  async generatePresignedUrl(
    fileName: string,
    contentType: string,
    folder: string = 'images',
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `${folder}/${dateStr}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    const fileUrl = `https://${this.bucketName}.s3.${this.configService.getOrThrow<AwsConfig>('aws').region}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }
}
