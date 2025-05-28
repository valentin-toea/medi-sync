/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/timelog/timelog.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum TimeLogStatus {
  VALID = 'valid',
  PENDING = 'pending',
  INVALID = 'invalid',
  CORRECTION_NEEDED = 'correction_needed',
}

@Entity('time_logs')
export class TimeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.timeLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'date' }) // The specific day of the timelog
  date: Date;

  @Column({ type: 'datetime', name: 'check_in', nullable: true })
  checkIn: Date;

  @Column({ type: 'datetime', name: 'check_out', nullable: true })
  checkOut: Date;

  @Column({ name: 'gps_location_checkin', nullable: true, length: 100 })
  gpsLocationCheckIn: string;

  @Column({ name: 'gps_location_checkout', nullable: true, length: 100 })
  gpsLocationCheckOut: string;

  @Column({
    type: 'simple-enum',
    enum: TimeLogStatus,
    default: TimeLogStatus.PENDING,
  })
  status: TimeLogStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
