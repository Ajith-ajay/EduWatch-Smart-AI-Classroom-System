import { Module } from '@nestjs/common';
import { AuditLogModule } from '../../common/modules/audit-log.module';
import { AuditLogsController } from './audit-logs.controller';

@Module({
  imports: [AuditLogModule],
  controllers: [AuditLogsController],
})
export class AuditLogsModule {}
