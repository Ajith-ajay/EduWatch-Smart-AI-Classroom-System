// Example of how to use Role-Based Access Control (RBAC) with your secured endpoints

import {
  Controller,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Example usage in a future controller:
@Controller('admin')
export class AdminController {
  // Only admins can access this endpoint
  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminDashboard(@CurrentUser() user: any) {
    return {
      message: `Welcome Admin ${user.email}`,
      role: user.role,
    };
  }

  // Only teachers can access this endpoint
  @Get('schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  getTeacherSchedule(@CurrentUser() user: any) {
    return {
      message: `Schedule for teacher ${user.email}`,
      role: user.role,
    };
  }

  // Multiple roles can access this endpoint
  @Post('report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  createReport(@CurrentUser() user: any) {
    return {
      message: `Report created by ${user.email}`,
      role: user.role,
    };
  }
}

// Usage in module:
/*
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
*/

// In your Database schema (Prisma), you should have a role field like:
/*
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  role  String  @default("teacher")  // "admin", "teacher", "student"
  ...
}
*/

// How it works:
// 1. User logs in and gets a JWT token with their role included
// 2. When accessing an endpoint, JwtAuthGuard validates the token
// 3. RolesGuard checks if the user's role is in the allowed roles
// 4. If allowed, the request proceeds; if not, 403 Forbidden is returned
// 5. CurrentUser decorator extracts the user object from the request

// Security Note:
// - The role is stored in the JWT token, so it's verified with the secret key
// - Make sure to update the user role in the database BEFORE generating new tokens
// - Consider implementing a logout mechanism that invalidates tokens
