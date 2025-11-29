import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';
import { ResponseException } from './common/exceptions/response.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');
  const logger = new Logger('Bootstrap');

  app.enableCors({
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '50mb' });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        return ResponseException.validationError(messages.join('; '));
      },
    }),
  );
  app.useStaticAssets('public', { prefix: '/public/' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('cse4205-api')
    .setDescription('cse4205-api 문서')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(appConfig.port, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
