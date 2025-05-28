/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/leave-request/leave-request.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum LeaveRequestType {
  ANNUAL_LEAVE = 'concediu_odihna',
  MEDICAL_LEAVE = 'concediu_medical',
  UNPAID_LEAVE = 'concediu_fara_plata',
  OTHER = 'altul',
}

export enum LeaveRequestStatus {
  PENDING = 'in_asteptare',
  APPROVED = 'aprobat',
  REJECTED = 'respins',
  CANCELLED = 'anulat',
}

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.leaveRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'simple-enum',
    enum: LeaveRequestType,
  })
  type: LeaveRequestType;

  @Column({
    type: 'simple-enum',
    enum: LeaveRequestStatus,
    default: LeaveRequestStatus.PENDING,
  })
  status: LeaveRequestStatus;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true }) // Stores path to the uploaded file
  attachment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.approvedLeaveRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedById?: number;

  @Column({ type: 'datetime', name: 'approved_at', nullable: true })
  approvedAt?: Date;
}
