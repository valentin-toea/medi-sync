/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/user/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleItem } from '../schedule/schedule-item.entity';
import { TimeLog } from '../timelog/timelog.entity';
import { LeaveRequest } from '../leave-request/leave-request.entity';
import { Notification } from '../notification/notification.entity';
import { OnCallAssignment } from '../on-call/on-call-assignment.entity';
import { OnCallSwap } from '../on-call-swap/on-call-swap.entity';
import { InternshipApplication } from '../internship/internship-application.entity';
import { Internship } from '../internship/internship.entity';
import { Auth } from '../auth/auth.entity'; // Assuming Auth entity stores hashed password

export enum UserRole {
  MEDIC = 'medic',
  ASISTENT = 'asistent',
  REZIDENT = 'rezident',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @Column({ unique: true, length: 13 })
  cnp: string; // Cod Numeric Personal

  @Column({ nullable: true, length: 50 })
  parafa: string; // Doctor's seal/stamp - only for medics

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 100 })
  specialty: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.MEDIC,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Auth, (auth) => auth.user)
  authEntries: Auth[];

  @OneToMany(() => ScheduleItem, (schedule: ScheduleItem) => schedule.user)
  schedule: ScheduleItem[];

  @OneToMany(() => TimeLog, (timeLog) => timeLog.user)
  timeLogs: TimeLog[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.user)
  leaveRequests: LeaveRequest[];

  @OneToMany(
    () => LeaveRequest,
    (approvedLeaveRequest) => approvedLeaveRequest.approvedBy,
  )
  approvedLeaveRequests: LeaveRequest[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => OnCallAssignment, (assignment) => assignment.user)
  onCallAssignments: OnCallAssignment[];

  @OneToMany(() => OnCallSwap, (swapRequest) => swapRequest.requester)
  onCallSwapRequests: OnCallSwap[];

  @OneToMany(() => InternshipApplication, (application) => application.user)
  internshipApplications: InternshipApplication[];

  // If medic_coordonator is a User
  @OneToMany(() => Internship, (internship) => internship.coordinator)
  coordinatedInternships: Internship[];
}
