import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { LeaveRequestType } from '../leave-request.entity';

export class CreateLeaveRequestDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsEnum(LeaveRequestType)
  @IsNotEmpty()
  type: LeaveRequestType;

  @IsString()
  @IsOptional()
  attachment?: string; // Path to file, will be set by controller
}
