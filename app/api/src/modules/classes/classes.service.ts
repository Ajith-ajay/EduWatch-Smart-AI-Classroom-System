import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(adminDepartment?: string, semester?: number, search?: string) {
    const classes = await this.prisma.classes.findMany({
      where: {
        ...(adminDepartment ? { department: adminDepartment } : {}),
        ...(typeof semester === 'number' ? { semester } : {}),
        ...(search
          ? {
              OR: [
                { class_name: { contains: search, mode: 'insensitive' } },
                { section: { contains: search, mode: 'insensitive' } },
                { department: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ department: 'asc' }, { semester: 'asc' }, { class_name: 'asc' }],
    });

    return classes;
  }

  async create(data: CreateClassDto, adminDepartment?: string) {
    const departmentToUse = this.resolveDepartment(data.department, adminDepartment);

    await this.ensureNoDuplicate(
      data.class_name,
      departmentToUse,
      data.semester,
      data.section,
    );

    return this.prisma.classes.create({
      data: {
        class_name: data.class_name.trim(),
        department: departmentToUse,
        semester: data.semester,
        section: data.section?.trim() || null,
      },
    });
  }

  async update(id: number, data: UpdateClassDto, adminDepartment?: string) {
    const existing = await this.prisma.classes.findUnique({
      where: { class_id: id },
    });

    if (!existing) {
      throw new NotFoundException('Class not found');
    }

    this.assertDepartmentAccess(existing.department, adminDepartment, 'Class update allowed only for your department');

    const merged = {
      class_name: data.class_name ?? existing.class_name,
      department: data.department ?? existing.department ?? undefined,
      semester: data.semester ?? existing.semester ?? undefined,
      section: data.section ?? existing.section ?? undefined,
    };

    const departmentToUse = this.resolveDepartment(merged.department, adminDepartment);

    await this.ensureNoDuplicate(
      merged.class_name,
      departmentToUse,
      merged.semester,
      merged.section,
      id,
    );

    return this.prisma.classes.update({
      where: { class_id: id },
      data: {
        class_name: merged.class_name.trim(),
        department: departmentToUse,
        semester: merged.semester,
        section: merged.section?.trim() || null,
      },
    });
  }

  async delete(id: number, adminDepartment?: string) {
    const existing = await this.prisma.classes.findUnique({
      where: { class_id: id },
    });

    if (!existing) {
      throw new NotFoundException('Class not found');
    }

    this.assertDepartmentAccess(existing.department, adminDepartment, 'Class delete allowed only for your department');

    await this.prisma.classes.delete({
      where: { class_id: id },
    });

    return { message: 'Class deleted successfully' };
  }

  private async ensureNoDuplicate(
    className: string,
    department?: string | null,
    semester?: number,
    section?: string,
    excludeId?: number,
  ) {
    const existing = await this.prisma.classes.findFirst({
      where: {
        class_name: className.trim(),
        department: department ?? null,
        semester: typeof semester === 'number' ? semester : null,
        section: section?.trim() || null,
        ...(excludeId ? { class_id: { not: excludeId } } : {}),
      },
    });

    if (existing) {
      throw new BadRequestException('A class with the same name, semester, section and department already exists');
    }
  }

  private resolveDepartment(payloadDepartment?: string, adminDepartment?: string) {
    if (adminDepartment && payloadDepartment && payloadDepartment !== adminDepartment) {
      throw new BadRequestException('You can manage classes only for your department');
    }

    return adminDepartment || payloadDepartment || null;
  }

  private assertDepartmentAccess(
    targetDepartment?: string | null,
    adminDepartment?: string,
    message = 'Access denied for this department',
  ) {
    if (adminDepartment && targetDepartment && targetDepartment !== adminDepartment) {
      throw new NotFoundException(message);
    }
  }
}
