import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';

interface RateLimitData {
  count: number;
  resetTime: number;
}

@Injectable()
export class ThrottleGuard implements CanActivate {
  // Store rate limit data in memory (for production, use Redis)
  private limitData = new Map<string, RateLimitData>();

  // Rate limit configuration
  private readonly DEFAULT_LIMIT = 100; // requests
  private readonly DEFAULT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Specific limits per endpoint
  private readonly ENDPOINT_LIMITS: Record<string, { limit: number; window: number }> = {
    '/auth/login': { limit: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    '/auth/signup': { limit: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    '/teachers': { limit: 50, window: 15 * 60 * 1000 }, // 50 requests per 15 minutes
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { ip, originalUrl, user } = request;

    // Use user ID if authenticated, otherwise use IP address
    const identifier = user?.userId ? `user_${user.userId}` : `ip_${ip}`;

    // Get endpoint path
    const endpoint = originalUrl.split('?')[0];

    // Get rate limit config for this endpoint
    const config = this.ENDPOINT_LIMITS[endpoint] || {
      limit: this.DEFAULT_LIMIT,
      window: this.DEFAULT_WINDOW,
    };

    const now = Date.now();

    // Get or initialize rate limit data
    let data = this.limitData.get(identifier);

    if (!data) {
      data = { count: 1, resetTime: now + config.window };
      this.limitData.set(identifier, data);
      return true;
    }

    // Reset if window has passed
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + config.window;
      return true;
    }

    // Increment counter
    data.count++;

    // Check if limit exceeded
    if (data.count > config.limit) {
      const retryAfter = Math.ceil((data.resetTime - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Please try again after ${retryAfter} seconds`,
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
        {
          cause: {
            retryAfter,
          },
        },
      );
    }

    return true;
  }

  // Cleanup old entries (call this periodically)
  cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, value] of this.limitData.entries()) {
      if (now > value.resetTime) {
        this.limitData.delete(key);
      }
    }
  }
}
