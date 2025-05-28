/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyInternshipDto {
  @IsNumber()
  @IsNotEmpty()
  utilizator_id: number; // userId
}
