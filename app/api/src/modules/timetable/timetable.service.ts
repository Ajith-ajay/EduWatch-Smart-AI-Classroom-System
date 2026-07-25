import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async getMeta(adminDepartment?: string) {
    const classes = await this.prisma.classes.findMany({
      where: adminDepartment ? { department: adminDepartment } : undefined,
      orderBy: [{ department: 'asc' }, { semester: 'asc' }, { class_name: 'asc' }],
      select: {
        class_id: true,
        class_name: true,
        department: true,
        semester: true,
        section: true,
      },
    });

    const subjects = await this.prisma.subjects.findMany({
      where: adminDepartment ? { department: adminDepartment } : undefined,
      orderBy: [{ department: 'asc' }, { subject_name: 'asc' }],
      select: {
        subject_id: true,
        subject_name: true,
        subject_code: true,
        department: true,
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

    return { classes, subjects, teachers };
  }

  async findAll(adminDepartment?: string, classId?: number, dayOfWeek?: string) {
    const rows = await this.prisma.timetable.findMany({
      where: {
        is_active: true,
        ...(classId ? { class_id: classId } : {}),
        ...(dayOfWeek ? { day_of_week: this.normalizeDay(dayOfWeek) } : {}),
        classes: adminDepartment ? { department: adminDepartment } : undefined,
      },
      include: {
        classes: {
          select: {
            class_name: true,
            department: true,
            semester: true,
            section: true,
          },
        },
        subjects: {
          select: {
            subject_name: true,
            subject_code: true,
            department: true,
          },
        },
        teachers: {
          select: {
            full_name: true,
            department: true,
          },
        },
      },
      orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
    });

    return rows.map((row) => this.serializeTimetable(row));
  }

  async create(data: CreateTimetableDto, adminDepartment?: string) {
    await this.validateReferences(data, adminDepartment);
    this.validateTimeWindow(data.start_time, data.end_time);
    await this.ensureNoOverlap(
      data.class_id,
      data.teacher_id,
      data.day_of_week,
      data.start_time,
      data.end_time,
    );

    const created = await this.prisma.timetable.create({
      data: {
        class_id: data.class_id,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        day_of_week: this.normalizeDay(data.day_of_week),
        start_time: this.toTimeDate(data.start_time),
        end_time: this.toTimeDate(data.end_time),
        is_active: true,
      },
      include: {
        classes: true,
        subjects: true,
        teachers: true,
      },
    });

    return this.serializeTimetable(created);
  }

  async update(id: number, data: UpdateTimetableDto, adminDepartment?: string) {
    const existing = await this.prisma.timetable.findUnique({
      where: { timetable_id: id },
      include: {
        classes: true,
      },
    });

    if (!existing || !existing.is_active) {
      throw new NotFoundException('Timetable entry not found');
    }

    if (adminDepartment && existing.classes.department !== adminDepartment) {
      throw new NotFoundException('Timetable update allowed only for your department');
    }

    const mergedData = {
      class_id: data.class_id ?? existing.class_id,
      subject_id: data.subject_id ?? existing.subject_id,
      teacher_id: data.teacher_id ?? existing.teacher_id,
      day_of_week: data.day_of_week ?? existing.day_of_week,
      start_time: data.start_time ?? this.formatTime(existing.start_time),
      end_time: data.end_time ?? this.formatTime(existing.end_time),
    };

    await this.validateReferences(mergedData, adminDepartment);
    this.validateTimeWindow(mergedData.start_time, mergedData.end_time);
    await this.ensureNoOverlap(
      mergedData.class_id,
      mergedData.teacher_id,
      mergedData.day_of_week,
      mergedData.start_time,
      mergedData.end_time,
      id,
    );

    const updated = await this.prisma.timetable.update({
      where: { timetable_id: id },
      data: {
        class_id: mergedData.class_id,
        subject_id: mergedData.subject_id,
        teacher_id: mergedData.teacher_id,
        day_of_week: this.normalizeDay(mergedData.day_of_week),
        start_time: this.toTimeDate(mergedData.start_time),
        end_time: this.toTimeDate(mergedData.end_time),
      },
      include: {
        classes: true,
        subjects: true,
        teachers: true,
      },
    });

    return this.serializeTimetable(updated);
  }

  async delete(id: number, adminDepartment?: string) {
    const existing = await this.prisma.timetable.findUnique({
      where: { timetable_id: id },
      include: {
        classes: true,
      },
    });

    if (!existing || !existing.is_active) {
      throw new NotFoundException('Timetable entry not found');
    }

    if (adminDepartment && existing.classes.department !== adminDepartment) {
      throw new NotFoundException('Timetable delete allowed only for your department');
    }

    await this.prisma.timetable.update({
      where: { timetable_id: id },
      data: { is_active: false },
    });

    return { message: 'Timetable entry deleted successfully' };
  }

  private async validateReferences(
    data: {
      class_id: number;
      subject_id: number;
      teacher_id: number;
    },
    adminDepartment?: string,
  ) {
    const [classItem, subject, teacher] = await Promise.all([
      this.prisma.classes.findUnique({
        where: { class_id: data.class_id },
      }),
      this.prisma.subjects.findUnique({
        where: { subject_id: data.subject_id },
      }),
      this.prisma.teachers.findUnique({
        where: { teacher_id: data.teacher_id },
      }),
    ]);

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (!teacher || !teacher.is_active) {
      throw new NotFoundException('Teacher not found');
    }

    if (
      adminDepartment &&
      (classItem.department !== adminDepartment ||
        subject.department !== adminDepartment ||
        teacher.department !== adminDepartment)
    ) {
      throw new BadRequestException('You can manage timetable only for your department');
    }
  }

  private validateTimeWindow(start: string, end: string) {
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);

    if (startMinutes >= endMinutes) {
      throw new BadRequestException('End time must be greater than start time');
    }
  }

  private async ensureNoOverlap(
    classId: number,
    teacherId: number,
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ) {
    const normalizedDay = this.normalizeDay(dayOfWeek);
    const dayEntries = await this.prisma.timetable.findMany({
      where: {
        day_of_week: normalizedDay,
        is_active: true,
        OR: [{ class_id: classId }, { teacher_id: teacherId }],
        ...(excludeId ? { timetable_id: { not: excludeId } } : {}),
      },
      select: {
        timetable_id: true,
        class_id: true,
        teacher_id: true,
        start_time: true,
        end_time: true,
      },
    });

    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    const overlaps = dayEntries.find((entry) => {
      const existingStart = this.timeToMinutes(this.formatTime(entry.start_time));
      const existingEnd = this.timeToMinutes(this.formatTime(entry.end_time));
      return start < existingEnd && end > existingStart;
    });

    if (!overlaps) {
      return;
    }

    if (overlaps.class_id === classId) {
      throw new BadRequestException('Class timetable overlaps with an existing period');
    }

    if (overlaps.teacher_id === teacherId) {
      throw new BadRequestException('Teacher already assigned to another class during this time');
    }
  }

  private toTimeDate(timeValue: string) {
    const normalized = this.normalizeTime(timeValue);
    const [hour, minute, second] = normalized.split(':').map(Number);
    return new Date(Date.UTC(1970, 0, 1, hour, minute, second));
  }

  private normalizeTime(timeValue: string) {
    const segments = timeValue.split(':');
    const [hour, minute, second] = [
      segments[0] ?? '00',
      segments[1] ?? '00',
      segments[2] ?? '00',
    ];
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
  }

  private formatTime(value: Date) {
    const hours = String(value.getUTCHours()).padStart(2, '0');
    const minutes = String(value.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private timeToMinutes(timeValue: string) {
    const normalized = this.normalizeTime(timeValue);
    const [hours, minutes] = normalized.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private normalizeDay(day: string) {
    const trimmed = day.trim().toLowerCase();
    return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  }

  private serializeTimetable(row: any) {
    return {
      timetable_id: row.timetable_id,
      class_id: row.class_id,
      subject_id: row.subject_id,
      teacher_id: row.teacher_id,
      day_of_week: row.day_of_week,
      start_time: this.formatTime(row.start_time),
      end_time: this.formatTime(row.end_time),
      is_active: row.is_active,
      created_at: row.created_at,
      class_name: row.classes?.class_name,
      class_department: row.classes?.department,
      class_semester: row.classes?.semester,
      class_section: row.classes?.section,
      subject_name: row.subjects?.subject_name,
      subject_code: row.subjects?.subject_code,
      teacher_name: row.teachers?.full_name,
    };
  }
}
