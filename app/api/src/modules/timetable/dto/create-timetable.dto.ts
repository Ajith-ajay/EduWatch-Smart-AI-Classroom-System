import { Type } from 'class-transformer';
import { IsIn, IsInt, IsString, Matches, Min } from 'class-validator';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export class CreateTimetableDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  class_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  subject_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  teacher_id: number;

  @IsString()
  @IsIn(daysOfWeek)
  day_of_week: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  start_time: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  end_time: string;
}
