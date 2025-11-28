import { registerAs } from '@nestjs/config';

export interface AwsConfig {
  region: string;
  s3BucketName: string;
}

export default registerAs(
  'aws',
  (): AwsConfig => ({
    region: process.env.AWS_REGION || 'ap-northeast-2',
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
  }),
);
