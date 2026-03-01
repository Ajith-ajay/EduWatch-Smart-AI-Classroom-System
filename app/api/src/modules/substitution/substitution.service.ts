import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubstitutionDto } from './dto/create-substitution.dto';

@Injectable()
export class SubstitutionService {
  constructor(private readonly prisma: PrismaService) {}

  async getMeta(adminDepartment?: string) {
    const classes = await this.prisma.classes.findMany({
      where: adminDepartment ? { department: adminDepartment } : undefined,
      orderBy: [{ semester: 'asc' }, { class_name: 'asc' }],
      select: {
        class_id: true,
        class_name: true,
        department: true,
        semester: true,
        section: true,
      },
    });

    const teachers = await this.prisma.teachers.findMany({
      where: {
        ...(adminDepartment ? { department: adminDepartment } : {}),
        is_active: true,
      },
      orderBy: { full_name: 'asc' },
      select: {
        teacher_id: true,
        full_name: true,
        department: true,
      },
    });

    const periods = await this.prisma.timetable.findMany({
      where: {
        is_active: true,
        classes: adminDepartment ? { department: adminDepartment } : undefined,
      },
      include: {
        classes: {
          select: {
            class_id: true,
            class_name: true,
            department: true,
            semester: true,
            section: true,
          },
        },
        subjects: {
          select: {
            subject_id: true,
            subject_name: true,
            subject_code: true,
          },
        },
        teachers: {
          select: {
            teacher_id: true,
            full_name: true,
            department: true,
          },
        },
      },
      orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
    });

    return {
      classes,
      teachers,
      periods: periods.map((item) => this.serializePeriod(item)),
    };
  }

  async getHistory(
    adminDepartment?: string,
    classId?: number,
    teacherId?: number,
  ) {
    const rows = await this.prisma.teacher_substitution.findMany({
      where: {
        ...(classId ? { timetable: { class_id: classId } } : {}),
        ...(teacherId
          ? {
              OR: [
                { original_teacher_id: teacherId },
                { substitute_teacher_id: teacherId },
              ],
            }
          : {}),
        timetable: {
          ...(classId ? { class_id: classId } : {}),
          classes: adminDepartment ? { department: adminDepartment } : undefined,
        },
      },
      include: {
        timetable: {
          include: {
            classes: {
              select: {
                class_id: true,
                class_name: true,
                department: true,
                semester: true,
                section: true,
              },
            },
            subjects: {
              select: {
                subject_id: true,
                subject_name: true,
                subject_code: true,
              },
            },
          },
        },
        teachers_teacher_substitution_original_teacher_idToteachers: {
          select: {
            teacher_id: true,
            full_name: true,
            department: true,
          },
        },
        teachers_teacher_substitution_substitute_teacher_idToteachers: {
          select: {
            teacher_id: true,
            full_name: true,
            department: true,
          },
        },
      },
      orderBy: { substitution_date: 'desc' },
    });

    return rows.map((item) => this.serializeHistory(item));
  }

  async createSwap(
    dto: CreateSubstitutionDto,
    adminDepartment?: string,
    approverEmail?: string,
  ) {
    const period = await this.prisma.timetable.findUnique({
      where: { timetable_id: dto.timetable_id },
      include: {
        classes: {
          select: {
            department: true,
          },
        },
      },
    });

    if (!period || !period.is_active) {
      throw new NotFoundException('Timetable period not found');
    }

    if (adminDepartment && period.classes.department !== adminDepartment) {
      throw new BadRequestException('You can manage substitutions only for your department');
    }

    const substituteTeacher = await this.prisma.teachers.findUnique({
      where: { teacher_id: dto.substitute_teacher_id },
    });

    if (!substituteTeacher || !substituteTeacher.is_active) {
      throw new NotFoundException('Substitute teacher not found');
    }

    if (adminDepartment && substituteTeacher.department !== adminDepartment) {
      throw new BadRequestException('You can assign substitute teacher only from your department');
    }

    if (period.teacher_id === dto.substitute_teacher_id) {
      throw new BadRequestException('Original teacher and substitute teacher cannot be the same');
    }

    const parsedDate = new Date(dto.substitution_date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid substitution date');
    }

    const created = await this.prisma.teacher_substitution.create({
      data: {
        timetable_id: dto.timetable_id,
        original_teacher_id: period.teacher_id,
        substitute_teacher_id: dto.substitute_teacher_id,
        substitution_date: parsedDate,
        approved_by: approverEmail || 'Admin',
      },
      include: {
        timetable: {
          include: {
            classes: true,
            subjects: true,
          },
        },
        teachers_teacher_substitution_original_teacher_idToteachers: true,
        teachers_teacher_substitution_substitute_teacher_idToteachers: true,
      },
    });

    return this.serializeHistory(created);
  }

  private formatTime(value: Date) {
    const hours = String(value.getUTCHours()).padStart(2, '0');
    const minutes = String(value.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private serializePeriod(item: any) {
    return {
      timetable_id: item.timetable_id,
      class_id: item.class_id,
      class_name: item.classes?.class_name,
      class_department: item.classes?.department,
      class_semester: item.classes?.semester,
      class_section: item.classes?.section,
      subject_id: item.subject_id,
      subject_name: item.subjects?.subject_name,
      subject_code: item.subjects?.subject_code,
      day_of_week: item.day_of_week,
      start_time: this.formatTime(item.start_time),
      end_time: this.formatTime(item.end_time),
      original_teacher_id: item.teacher_id,
      original_teacher_name: item.teachers?.full_name,
    };
  }

  private serializeHistory(item: any) {
    return {
      substitution_id: item.substitution_id,
      timetable_id: item.timetable_id,
      substitution_date: item.substitution_date,
      approved_by: item.approved_by,
      created_at: item.created_at,
      class_id: item.timetable?.class_id,
      class_name: item.timetable?.classes?.class_name,
      class_department: item.timetable?.classes?.department,
      class_semester: item.timetable?.classes?.semester,
      class_section: item.timetable?.classes?.section,
      subject_name: item.timetable?.subjects?.subject_name,
      subject_code: item.timetable?.subjects?.subject_code,
      day_of_week: item.timetable?.day_of_week,
      start_time: item.timetable?.start_time ? this.formatTime(item.timetable.start_time) : null,
      end_time: item.timetable?.end_time ? this.formatTime(item.timetable.end_time) : null,
      original_teacher_id: item.original_teacher_id,
      original_teacher_name:
        item.teachers_teacher_substitution_original_teacher_idToteachers?.full_name,
      substitute_teacher_id: item.substitute_teacher_id,
      substitute_teacher_name:
        item.teachers_teacher_substitution_substitute_teacher_idToteachers?.full_name,
    };
  }
}
