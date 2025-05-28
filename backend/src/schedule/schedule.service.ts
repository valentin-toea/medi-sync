// src/schedule/schedule.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ScheduleItem } from './schedule-item.entity';
// User entity import might be needed if not already present for type safety, though not strictly for the query change itself.
// import { User } from '../user/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleItem)
    private scheduleRepo: Repository<ScheduleItem>,
  ) {}

  async findByUser(userIdInput: number): Promise<ScheduleItem[]> {
    return this.scheduleRepo.find({
      where: { user: { id: userIdInput } }, // Query by the user's ID through the 'user' relation
      // This will translate to a condition on the 'user_id' foreign key column
      order: { startDate: 'ASC' },
    });
  }

  async findTodayByUser(userIdInput: number): Promise<ScheduleItem[]> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    return this.scheduleRepo.find({
      where: [
        {
          user: { id: userIdInput }, // Updated to query via relation
          startDate: Between(startOfDay, endOfDay),
        },
        {
          user: { id: userIdInput }, // Updated to query via relation
          endDate: Between(startOfDay, endOfDay),
        },
        {
          user: { id: userIdInput }, // Updated to query via relation
          startDate: LessThanOrEqual(startOfDay),
          endDate: MoreThanOrEqual(endOfDay),
        },
      ],
      order: { startDate: 'ASC' },
    });
  }
}
