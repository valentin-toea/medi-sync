/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { LeaveRequestType } from '../leave-request.entity';

export class CreateLeaveRequestDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string; // YYYY-MM-DD

  @IsDateString()
  @IsNotEmpty()
  endDate: string; // YYYY-MM-DD

  @IsEnum(LeaveRequestType)
  @IsNotEmpty()
  type: LeaveRequestType;

  @IsString()
  @IsOptional()
  attachment?: string; // Path to file, will be set by controller
}
