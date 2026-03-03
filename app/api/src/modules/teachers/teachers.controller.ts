import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { join } from 'path';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // CREATE TEACHER (Protected)
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('staff_image'))
  async create(
    @Body() dto: CreateTeacherDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const imagePath = file ? join(process.cwd(), 'uploads', 'staff', file.filename) : undefined;
    const adminDepartment = req.user?.admin_code;
    return this.teachersService.create(dto, imagePath, adminDepartment);
  }

  // LIST ALL TEACHERS (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any) {
    const adminDepartment = req.user?.admin_code;
    return this.teachersService.findAll(adminDepartment);
  }

  // UPDATE TEACHER (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('staff_image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeacherDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    const imagePath = file ? `/uploads/staff/${file.filename}` : undefined;
    const adminDepartment = req.user?.admin_code;
    return this.teachersService.update(id, dto, imagePath, adminDepartment);
  }

  // DELETE TEACHER (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req?: any,
  ) {
    const adminDepartment = req.user?.admin_code;
    return this.teachersService.delete(id, adminDepartment);
  }
}