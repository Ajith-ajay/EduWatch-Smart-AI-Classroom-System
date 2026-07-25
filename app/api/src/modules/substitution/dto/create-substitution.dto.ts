import { Type } from 'class-transformer';
import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateSubstitutionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  timetable_id!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  substitute_teacher_id!: number;

  @IsDateString()
  substitution_date!: string;
}
