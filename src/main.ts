import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';

async function bootstrap() {
  const app = await NestFactory.create(BookModule);
  const port = process.env.PORT;
  await app.listen(port??8080);
}
bootstrap();
