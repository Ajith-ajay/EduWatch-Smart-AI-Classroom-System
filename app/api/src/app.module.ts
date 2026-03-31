import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditLogModule } from './common/modules/audit-log.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { ThrottleModule } from './common/modules/throttle.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { ClassesModule } from './modules/classes/classes.module';
import { SubstitutionModule } from './modules/substitution/substitution.module';

@Module({
  imports: [
    TeachersModule,
    AuthModule,
    AuditLogModule,
    AuditLogsModule,
    ThrottleModule,
    TimetableModule,
    ClassesModule,
    SubstitutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
