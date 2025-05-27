/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/on-call-swap/on-call-swap.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OnCall } from '../on-call/on-call.entity'; // The general on-call slot

export enum OnCallSwapStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('on_call_swaps')
export class OnCallSwap {
  @PrimaryGeneratedColumn()
  id: number;

  // The on-call slot the user wants to swap out of
  @ManyToOne(() => OnCall, (onCall) => onCall.swapRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'on_call_id' })
  onCall: OnCall;

  @Column()
  onCallId: number;

  // The user requesting the swap
  @ManyToOne(() => User, (user) => user.onCallSwapRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column()
  requesterId: number;

  // Users selected by the requester as potential replacements
  @ManyToMany(() => User)
  @JoinTable({
    name: 'on_call_swap_potential_replacements',
    joinColumn: { name: 'on_call_swap_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  potentialReplacements: User[];
  // @Column({ type: 'simple-array', name: 'selected_replacements_ids', nullable: true })
  // selectedReplacementsIds: number[]; // Store User IDs

  @CreateDateColumn({ name: 'request_date' })
  requestDate: Date;

  @Column({
    type: 'simple-enum',
    enum: OnCallSwapStatus,
    default: OnCallSwapStatus.PENDING,
  })
  status: OnCallSwapStatus;

  // User who approved/rejected the swap (admin/manager)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'processed_by_id' })
  processedBy?: User;

  @Column({ nullable: true })
  processedById?: number;

  // User who accepted to take the shift
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'accepted_by_id' })
  acceptedBy?: User;

  @Column({ nullable: true })
  acceptedById?: number;

  @Column({ type: 'datetime', name: 'processed_at', nullable: true })
  processedAt?: Date;
}
