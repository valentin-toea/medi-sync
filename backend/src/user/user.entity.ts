import { ScheduleItem } from 'src/schedule/schedule-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => ScheduleItem, (schedule: ScheduleItem) => schedule.user)
  schedule: ScheduleItem[];
}
