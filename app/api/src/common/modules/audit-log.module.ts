import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditLogService } from '../services/audit-log.service';
import { AuditLogInterceptor } from '../interceptors/audit-log.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [AuditLogService, AuditLogInterceptor],
  exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditLogModule {}
