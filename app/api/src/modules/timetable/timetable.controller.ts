import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { TimetableService } from './timetable.service';

@Controller('timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('meta')
  getMeta(@Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.timetableService.getMeta(adminDepartment);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('class_id') classId?: string,
    @Query('day') day?: string,
  ) {
    const adminDepartment = req.user?.admin_code;
    const parsedClassId = classId ? parseInt(classId, 10) : undefined;
    return this.timetableService.findAll(adminDepartment, parsedClassId, day);
  }

  @Post()
  create(@Body() dto: CreateTimetableDto, @Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.timetableService.create(dto, adminDepartment);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTimetableDto,
    @Req() req: any,
  ) {
    const adminDepartment = req.user?.admin_code;
    return this.timetableService.update(id, dto, adminDepartment);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.timetableService.delete(id, adminDepartment);
  }
}
