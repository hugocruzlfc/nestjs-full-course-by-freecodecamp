import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 👈 Elimina los campos que no esten en el DTO
      forbidNonWhitelisted: true, // 👈 Devuelve un error cuando no esten en el DTO
      transform: true, // 👈 Convierte los tipos de datos a los especificados en el DTO
    }),
  ); // 👈 Agregamos el uso de los pipes globales
  await app.listen(4000);
}
bootstrap();
