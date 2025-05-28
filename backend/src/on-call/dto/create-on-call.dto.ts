/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OnCallAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  assignedRole?: string; // e.g., 'Medic Titular'

  @IsString()
  @IsOptional() // HH:mm:ss format
  startTime?: string;

  @IsString()
  @IsOptional() // HH:mm:ss format
  endTime?: string;
}
export class CreateOnCallDto {
  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsBoolean()
  @IsOptional()
  isStaffSufficient?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnCallAssignmentDto)
  @IsOptional()
  assignments?: OnCallAssignmentDto[];
}
