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
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  findAll(
    @Req() req: any,
    @Query('semester') semester?: string,
    @Query('search') search?: string,
  ) {
    const adminDepartment = req.user?.admin_code;
    const parsedSemester = semester ? parseInt(semester, 10) : undefined;
    return this.classesService.findAll(adminDepartment, parsedSemester, search);
  }

  @Post()
  create(@Body() dto: CreateClassDto, @Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.classesService.create(dto, adminDepartment);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassDto,
    @Req() req: any,
  ) {
    const adminDepartment = req.user?.admin_code;
    return this.classesService.update(id, dto, adminDepartment);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.classesService.delete(id, adminDepartment);
  }
}
