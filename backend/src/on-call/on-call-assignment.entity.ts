// src/on-call/on-call-assignment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OnCall } from './on-call.entity';

@Entity('on_call_assignments')
export class OnCallAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OnCall, (onCall) => onCall.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'on_call_id' })
  onCall: OnCall;

  @Column()
  onCallId: number;

  @ManyToOne(() => User, (user) => user.onCallAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  // Specific role during this on-call, if needed, e.g., 'Medic Titular', 'Asistent'
  @Column({ name: 'assigned_role', length: 100, nullable: true })
  assignedRole: string;

  // If an on-call day has multiple shifts/intervals for different people
  @Column({ type: 'time', name: 'start_time', nullable: true })
  startTime: string; // e.g., "08:00:00"

  @Column({ type: 'time', name: 'end_time', nullable: true })
  endTime: string; // e.g., "20:00:00"
}
