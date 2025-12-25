import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Converte automaticamente strings do JSON para os tipos do DTO (number)
  }));

//   Isso serve para permitir que diferentes portas possam acessar a API, durante o desenvolvimento;
// Deve ser colocado após o const app;
// // CORS liberado para desenvolvimento
  app.enableCors({
    origin: true, // Aceita qualquer origem em desenvolvimento
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();