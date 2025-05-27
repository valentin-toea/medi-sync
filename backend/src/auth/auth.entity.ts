// src/auth/auth.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.authEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  @Column()
  email: string; // Can be redundant if always same as user.email, but useful for quick lookup

  @Column()
  passwordHash: string;

  // Optionally, for refresh tokens:
  // @Column({ type: 'text', nullable: true })
  // refreshToken?: string;

  // @Column({ type: 'datetime', nullable: true })
  // refreshTokenExpiresAt?: Date;
}
