import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { CommandFactory } from 'nest-commander';
import { CommandModule } from './commands/command.module';
import * as process from 'process';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
async function bootstrapCmd() {
  await CommandFactory.run(CommandModule, ['warn', 'error', 'debug', 'log']);
}
if (process.env.MODE === 'cmd') {
  bootstrapCmd();
} else {
  console.log(1);
  bootstrap();
}
