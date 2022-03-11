import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function configureSwagger(app: INestApplication, configService: ConfigService) {
  if (configService.get('APP_EXPOSE_DOCS') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('APP_NAME'))
      .setDescription(
        `This is a documentation for the api ${configService.get('APP_NAME')}`,
      )
      .setVersion(configService.get('APP_VERSION'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const DOCS_PATH = configService.get('APP_DOCS_PATH') || '/docs';

    SwaggerModule.setup(DOCS_PATH, app, document);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  configureSwagger(app, configService);

  const PORT = configService.get<string>('PORT') || '8080';
  await app.listen(PORT);
}
bootstrap();
