import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubstitutionDto } from './dto/create-substitution.dto';
import { SubstitutionService } from './substitution.service';

@Controller('substitution')
@UseGuards(JwtAuthGuard)
export class SubstitutionController {
  constructor(private readonly substitutionService: SubstitutionService) {}

  @Get('meta')
  getMeta(@Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.substitutionService.getMeta(adminDepartment);
  }

  @Get('history')
  getHistory(
    @Req() req: any,
    @Query('class_id') classId?: string,
    @Query('teacher_id') teacherId?: string,
  ) {
    const adminDepartment = req.user?.admin_code;
    const parsedClassId = classId ? parseInt(classId, 10) : undefined;
    const parsedTeacherId = teacherId ? parseInt(teacherId, 10) : undefined;
    return this.substitutionService.getHistory(
      adminDepartment,
      parsedClassId,
      parsedTeacherId,
    );
  }

  @Post('swap')
  createSwap(@Body() dto: CreateSubstitutionDto, @Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    const approverEmail = req.user?.email;
    return this.substitutionService.createSwap(dto, adminDepartment, approverEmail);
  }
}
