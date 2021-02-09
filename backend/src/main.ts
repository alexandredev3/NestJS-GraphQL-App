import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * cannot inject dependencies since this is done outside the context of any module
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3333);
}
bootstrap();
