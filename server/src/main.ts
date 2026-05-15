import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: [
      process.env.FRONT_END_HOSTED,
      process.env.FRONT_END_LOCAL,
    ],
    credentials: true,
    methods: ["POST", "PUT", "UPDATE", "PATCH", "GET"],
  })

  const config = new DocumentBuilder()
    .setTitle("CardKeeper API")
    .setDescription("Api documentation for cardkeeper")
    .setVersion("0.0.1")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
