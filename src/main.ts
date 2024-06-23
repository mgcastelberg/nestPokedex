import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true, //Valida que en la peticion lleguen ezactamaente los atributos definidos
       forbidNonWhitelisted: true, //Regresa error si vienen atributos extras
       transform: true, //transforme la info
       transformOptions: {
        enableImplicitConversion: true //para que pase la validación de que es un numero
       }
   })
  );

  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
