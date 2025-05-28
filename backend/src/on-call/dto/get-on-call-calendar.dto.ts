/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetOnCallCalendarDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format' })
  luna: string; // YYYY-MM
}
