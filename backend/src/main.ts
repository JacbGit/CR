import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: (requestOrigin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) 
        : ['http://localhost:3000'];
      
      // Permitir requests sin origin (como Postman), dominios en lista blanca, o cualquier deploy de Vercel
      if (!requestOrigin || allowedOrigins.includes(requestOrigin) || requestOrigin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.log(`🚫 CORS bloqueó origen: ${requestOrigin}`);
        callback(null, false);
      }
    },
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
