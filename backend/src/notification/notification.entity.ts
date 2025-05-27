/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/notification/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ name: 'sent_date' })
  sentDate: Date;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'datetime', name: 'read_at', nullable: true })
  readAt: Date;
}
