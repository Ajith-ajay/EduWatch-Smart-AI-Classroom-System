import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  qualification?: string;
}