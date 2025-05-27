// src/on-call/on-call.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { OnCallAssignment } from './on-call-assignment.entity';
import { OnCallSwap } from '../on-call-swap/on-call-swap.entity';

@Entity('on_calls')
@Index(['date', 'specialty'], { unique: true }) // A specialty can only have one on-call definition per day
export class OnCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 100 })
  specialty: string; // e.g., Cardiologie, Neurologie

  @Column({ type: 'text', nullable: true })
  details: string; // General details for this on-call day/specialty

  @Column({ type: 'boolean', name: 'is_staff_sufficient', default: false })
  isStaffSufficient: boolean; // This might be manually set or automatically calculated

  // This defines who IS on call
  @OneToMany(() => OnCallAssignment, (assignment) => assignment.onCall)
  assignments: OnCallAssignment[];

  // This defines who WANTS to swap this on-call slot
  @OneToMany(() => OnCallSwap, (swap) => swap.onCall)
  swapRequests: OnCallSwap[];
}
