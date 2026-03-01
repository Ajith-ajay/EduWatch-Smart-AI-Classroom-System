import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditLogModule } from './common/modules/audit-log.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { ThrottleModule } from './common/modules/throttle.module';

@Module({
  imports: [
    TeachersModule,
    AuthModule,
    AuditLogModule,
    AuditLogsModule,
    ThrottleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
