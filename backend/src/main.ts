import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  const corsOrigin = process.env.CORS_ORIGIN;
  const origin = corsOrigin && corsOrigin.includes(',') 
    ? corsOrigin.split(',').map(o => o.trim()) 
    : corsOrigin || 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🎰 Casino Royal Backend corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación API: http://localhost:${port}/api`);
}

bootstrap();
