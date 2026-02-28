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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // CREATE TEACHER
  @Post()
  @UseInterceptors(FileInterceptor('staff_image'))
  async create(
    @Body() dto: CreateTeacherDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/staff/${file.filename}` : undefined;
    return this.teachersService.create(dto, imagePath);
  }

  // LIST ALL TEACHERS
  @Get()
  async findAll() {
    return this.teachersService.findAll();
  }

  // UPDATE TEACHER
  @Put(':id')
  @UseInterceptors(FileInterceptor('staff_image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeacherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/staff/${file.filename}` : undefined;
    return this.teachersService.update(id, dto, imagePath);
  }

  // DELETE TEACHER
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.delete(id);
  }
}