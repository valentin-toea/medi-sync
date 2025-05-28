/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/internship/internship.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InternshipApplication } from './internship-application.entity';
import { User } from '../user/user.entity'; // Assuming medic_coordonator can be a User

@Entity('internships')
export class Internship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 }) // denumire
  name: string;

  @Column({ type: 'text' }) // descriere
  description: string;

  // perioada - can be split into startDate and endDate
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  // medic_coordonator
  @ManyToOne(() => User, (user) => user.coordinatedInternships, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator?: User;

  @Column({ nullable: true })
  coordinatorId?: number;

  // Fallback if coordinator is just a name string
  @Column({ name: 'coordinator_name', length: 200, nullable: true })
  coordinatorName?: string;

  @Column({ name: 'location', length: 255 }) // loc_desfasurare
  location: string;

  @Column({ name: 'number_of_hours', type: 'int' }) // nr_ore
  numberOfHours: number;

  @Column({ name: 'minimum_procedures', type: 'int', nullable: true }) // minim_proceduri
  minimumProcedures: number;

  @Column({ type: 'date', name: 'test_date', nullable: true }) // data_test
  testDate: Date;

  @OneToMany(
    () => InternshipApplication,
    (application: InternshipApplication) => application.internship,
  )
  applications: InternshipApplication[];
}
