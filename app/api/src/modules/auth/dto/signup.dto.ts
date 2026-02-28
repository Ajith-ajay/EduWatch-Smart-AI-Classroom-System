import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirm_password: string;

  @IsNotEmpty()
  institution: string;
}