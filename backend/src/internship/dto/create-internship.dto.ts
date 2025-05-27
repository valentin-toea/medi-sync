/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateInternshipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  coordinatorName?: string;

  @IsNumber()
  @IsOptional()
  coordinatorId?: number; // If coordinator is a User

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfHours: number;

  @IsNumber()
  @IsOptional()
  minimumProcedures?: number;

  @IsDateString()
  @IsOptional()
  testDate?: string;
}
