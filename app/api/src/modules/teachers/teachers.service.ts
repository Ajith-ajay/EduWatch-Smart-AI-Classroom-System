import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { promises as fs } from 'fs';
import { join, extname } from 'path';

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

  async create(
    data: CreateTeacherDto,
    tempImagePath?: string,
    adminDepartment?: string,
  ) {

    if (data.department !== adminDepartment) {
      throw new NotFoundException('Adding Teacher Only for your Department');
    }

    let teacher;

    try {
      // 1️⃣ Create teacher first
      teacher = await this.prisma.teachers.create({
        data: {
          ...data,
          staff_image_path: 'pending',
        },
      });
    } catch (error) {

      // If DB insert fails → delete temp file
      if (tempImagePath) {
        try { await fs.unlink(tempImagePath); } catch {}
      }

      throw error;
    }

    // 2️⃣ Handle image if exists
    if (tempImagePath) {
      const ext = extname(tempImagePath);
      const newFilename = `${teacher.teacher_id}${ext}`;
      const newPath = join(process.cwd(), 'uploads', 'staff', newFilename);

      try {
        await fs.rename(tempImagePath, newPath);

        await this.prisma.teachers.update({
          where: { teacher_id: teacher.teacher_id },
          data: { staff_image_path: `/uploads/staff/${newFilename}` },
        });

      } catch (error) {

        // If rename fails → remove teacher record
        await this.prisma.teachers.delete({
          where: { teacher_id: teacher.teacher_id },
        });

        // Cleanup temp file if still exists
        try { await fs.unlink(tempImagePath); } catch {}

        throw error;
      }
    }

    return teacher;
  }

  async findAll(adminDepartment?: string) {
    return this.prisma.teachers.findMany({
      where: adminDepartment ? { department: adminDepartment } : undefined,
      orderBy: { created_at: 'desc' },
      select: this.teacherSelect,
    });
  }

  async update(id: number, data: UpdateTeacherDto, imagePath?: string, adminDepartment?: string) {
    const teacher = await this.prisma.teachers.findUnique({
      where: { teacher_id: id },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');

    if(teacher.department !== adminDepartment) {
      throw new NotFoundException('Teacher Update Only for your Department');
    }

    const updateData = {
      ...data,
      ...(imagePath && { staff_image_path: imagePath }),
    };

    return this.prisma.teachers.update({
      where: { teacher_id: id },
      data: updateData,
    });
  }

  async delete(id: number, adminDepartment?: string) {
    return this.prisma.$transaction(async (tx) => {

      const teacher = await tx.teachers.findUnique({
        where: { teacher_id: id },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      if(teacher.department !== adminDepartment) {
        throw new NotFoundException('Teacher Delete Only for your Department');
      }

      // 1️⃣ Archive image first (outside DB safety but fine)
      if (teacher.staff_image_path && teacher.staff_image_path !== 'pending') {
        try {
          const filename = teacher.staff_image_path.split('/').pop();

          if (filename) {
            const sourcePath = join(process.cwd(), 'uploads', 'staff', filename);
            const archiveDir = join(process.cwd(), 'uploads', 'staff', 'archive');
            const archivePath = join(archiveDir, filename);

            await fs.mkdir(archiveDir, { recursive: true });
            await fs.rename(sourcePath, archivePath);
          }
        } catch (error) {
          console.error('Image archive failed:', error);
          // We continue — file failure should not corrupt DB
        }
      }

      // 2️⃣ Insert into archive table
      await tx.teachers_archive.create({
        data: {
          teacher_id: teacher.teacher_id,
          full_name: teacher.full_name,
          email: teacher.email,
          department: teacher.department,
          phone: teacher.phone,
          qualification: teacher.qualification,
          staff_image_path: teacher.staff_image_path,
          is_active: teacher.is_active,
          created_at: teacher.created_at,
          updated_at: teacher.updated_at,
        },
      });

      // 3️⃣ Delete from main table
      await tx.teachers.delete({
        where: { teacher_id: id },
      });

      return { message: 'Teacher archived successfully' };
    });
  }
}