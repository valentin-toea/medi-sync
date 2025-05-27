// src/schedule/schedule-item.entity.ts
// No changes needed based on the new requirements, it maps well:
// name -> activitate
// startDate, endDate -> data, interval
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('schedule_items') // Explicit table name
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // Represents 'activitate'
  name: string;

  @Column({ type: 'datetime' }) // Combined with endDate, represents 'data' and 'interval'
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @ManyToOne(() => User, (user: User) => user.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Ensure correct column name
  user: User;

  @Column()
  userId: number;
}
