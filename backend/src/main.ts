import 'reflect-metadata';
import { randomUUID } from 'crypto';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  integrations: [
    nodeProfilingIntegration(),
  ],
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV || 'development',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace',
  enableLogs: true,
});

// Polyfill crypto for TypeORM compatibility
if (!globalThis.crypto) {
  globalThis.crypto = { randomUUID } as any;
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Use WebSocket adapter for ws library
  app.useWebSocketAdapter(new WsAdapter(app));

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));



  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Brother Terminal Trading API')
    .setDescription('API for managing trading positions and orders on the Brother Terminal platform for Hyperliquid Engine.')
    .setVersion('3.0.0')
    .setContact('Brother Terminal', 'https://brother-terminal.xyz', 'dev@brother-terminal.xyz')
    .addServer('https://api.brother-terminal.xyz', 'Production (Mainnet)')
    .addServer('https://api-testnet.brother-terminal.xyz', 'Testnet')
    .addBearerAuth()
    .build();

  // Ensure OpenAPI 3.0.3 format
  config.openapi = '3.0.3';

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Write swagger document to file
  const fs = require('fs');
  const path = require('path');

  const swaggerPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));

  const logger = app.get(Logger);
  logger.log(`Swagger documentation written to: ${swaggerPath}`, 'Bootstrap');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger documentation: http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();