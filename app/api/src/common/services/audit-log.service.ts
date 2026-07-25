import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogData {
  userId?: number;
  userEmail?: string;
  method: string;
  endpoint: string;
  statusCode: number;
  requestBody?: string;
  responseBody?: string;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
  executionTime: number;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          userEmail: data.userEmail,
          method: data.method,
          endpoint: data.endpoint,
          statusCode: data.statusCode,
          requestBody: data.requestBody ? data.requestBody.substring(0, 1000) : null,
          responseBody: data.responseBody ? data.responseBody.substring(0, 1000) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          errorMessage: data.errorMessage,
          executionTime: data.executionTime,
        },
      });
    } catch (error) {
      // Don't throw error - audit logging should not break the main flow
      console.error('Failed to log audit entry:', error);
    }
  }

  async getLogs(
    page: number = 1,
    limit: number = 50,
    userId?: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLogsByEndpoint(endpoint: string, limit: number = 100) {
    return this.prisma.auditLog.findMany({
      where: {
        endpoint: {
          contains: endpoint,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserActivitySummary(userId: number) {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    const summary = {
      totalRequests: logs.length,
      successfulRequests: logs.filter((l) => l.statusCode < 400).length,
      failedRequests: logs.filter((l) => l.statusCode >= 400).length,
      averageResponseTime:
        logs.length > 0
          ? Math.round(logs.reduce((sum, l) => sum + l.executionTime, 0) / logs.length)
          : 0,
      recentActivity: logs.slice(0, 10),
    };

    return summary;
  }
}
