/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { LeaveRequestStatus } from '../leave-request.entity';

export class UpdateLeaveRequestStatusDto {
  @IsEnum(LeaveRequestStatus)
  @IsNotEmpty()
  status: LeaveRequestStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
