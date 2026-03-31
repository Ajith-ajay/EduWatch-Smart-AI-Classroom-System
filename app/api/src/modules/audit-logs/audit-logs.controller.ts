import { Controller, Get, Query, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { AuditLogService } from '../../common/services/audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AuditLogsController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  async getLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditLogService.getLogs(
      parseInt(page),
      parseInt(limit),
      userId ? parseInt(userId) : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('endpoint/:endpoint')
  async getLogsByEndpoint(
    @Param('endpoint') endpoint: string,
    @Query('limit') limit: string = '100',
  ) {
    return this.auditLogService.getLogsByEndpoint(endpoint, parseInt(limit));
  }

  @Get('user/:userId/summary')
  async getUserActivitySummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.auditLogService.getUserActivitySummary(userId);
  }
}
