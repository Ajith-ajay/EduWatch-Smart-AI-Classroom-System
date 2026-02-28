import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  private readonly teacherSelect = {
    teacher_id: true,
    full_name: true,
    staff_image_path: true,
    email: true,
    department: true,
    phone: true,
    qualification: true,
    is_active: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeacherDto, imagePath?: string) {
    return this.prisma.teacher.create({
        data: {
        ...data,
        staff_image_path: imagePath ?? null,
        face_encoding_path: 'pending',
        },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      orderBy: { created_at: 'desc' },
      select: this.teacherSelect,
    });
  }

  async update(id: number, data: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { teacher_id: id },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');

    return this.prisma.teacher.update({
      where: { teacher_id: id },
      data,
    });
  }
}