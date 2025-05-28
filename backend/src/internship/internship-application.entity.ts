/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/internship/internship-application.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Internship } from './internship.entity';

export enum InternshipApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('internship_applications')
export class InternshipApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.internshipApplications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User; // The resident applying

  @Column()
  userId: number;

  @ManyToOne(() => Internship, (internship) => internship.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'internship_id' })
  internship: Internship;

  @Column()
  internshipId: number;

  @Column({
    type: 'simple-enum',
    enum: InternshipApplicationStatus,
    default: InternshipApplicationStatus.PENDING,
  })
  status: InternshipApplicationStatus;

  @CreateDateColumn({ name: 'application_date' })
  applicationDate: Date;
}
