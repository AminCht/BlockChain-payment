import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { CommandFactory } from 'nest-commander';
import { CommandModule } from './commands/command.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('BlockChain Payment')
    .setDescription('The BlockChain Payment API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
async function bootstrapCmd() {
  await CommandFactory.run(CommandModule, ['warn', 'error', 'debug', 'log']);
}
if (process.env.MODE === 'cmd') {
  bootstrapCmd();
} else {
  bootstrap();
}
