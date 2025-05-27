/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTimeLogDto {
  @IsNotEmpty()
  userId: number;

  @IsOptional() // Will default to current day in service
  @IsDateString()
  date?: string; // YYYY-MM-DD

  @IsDateString()
  checkInTime: string; // ISO datetime string

  @IsString()
  @IsNotEmpty()
  gpsLocationCheckIn: string;
}

export class CheckOutDto {
  @IsNotEmpty()
  userId: number;

  @IsDateString()
  checkOutTime: string; // ISO datetime string

  @IsString()
  @IsNotEmpty()
  gpsLocationCheckOut: string;
}

export class GetTimeLogQueryDto {
  @IsDateString()
  @IsNotEmpty()
  data: string; // YYYY-MM-DD
}
