import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { ThrottleGuard } from './common/guards/throttle.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Get services
  const auditLogInterceptor = app.get(AuditLogInterceptor);
  const throttleGuard = app.get(ThrottleGuard);

  // Global interceptor for audit logging
  app.useGlobalInterceptors(auditLogInterceptor);

  // Global guard for rate limiting
  app.useGlobalGuards(throttleGuard);

  // Static assets
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(5000);
  console.log('✅ API Server running on http://localhost:5000');
  console.log('✅ Rate Limiting: Enabled');
  console.log('✅ Audit Logging: Enabled');
}
bootstrap();