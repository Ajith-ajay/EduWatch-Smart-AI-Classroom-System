import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {}
