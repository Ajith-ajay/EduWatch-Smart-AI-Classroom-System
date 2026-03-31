import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../services/audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const startTime = Date.now();
    const { method, url, user, ip } = request;
    const endpoint = url.split('?')[0]; // Remove query params from endpoint
    const userAgent = request.get ? request.get('user-agent') : request.headers?.['user-agent'];

    let requestBody: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      requestBody = JSON.stringify(request.body);
    }

    return next.handle().pipe(
      tap((responseData) => {
        const executionTime = Date.now() - startTime;
        const statusCode = response.statusCode || 200;

        // Log successful request
        this.auditLogService.log({
          userId: user?.userId,
          userEmail: user?.email,
          method,
          endpoint,
          statusCode,
          requestBody,
          responseBody: JSON.stringify(responseData).substring(0, 1000),
          ipAddress: ip,
          userAgent,
          executionTime,
        });
      }),
      catchError((error) => {
        const executionTime = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Log error request
        this.auditLogService.log({
          userId: user?.userId,
          userEmail: user?.email,
          method,
          endpoint,
          statusCode,
          requestBody,
          ipAddress: ip,
          userAgent,
          errorMessage: error.message || 'Unknown error',
          executionTime,
        });

        throw error;
      }),
    );
  }
}