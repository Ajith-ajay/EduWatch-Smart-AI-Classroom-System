import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  class_name!: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  semester?: number;

  @IsOptional()
  @IsString()
  section?: string;
}
