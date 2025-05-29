import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class OnCallAssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  date: string; // YYYY-MM-DD
}
