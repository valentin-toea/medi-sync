// src/schedule/schedule.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleItem } from './schedule-item.entity';

import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleItem)
    private scheduleRepo: Repository<ScheduleItem>,
  ) {}

  async findByUser(userId: number): Promise<ScheduleItem[]> {
    return this.scheduleRepo.find({
      where: { userId },
      order: { startDate: 'ASC' },
    });
  }

  async findTodayByUser(userId: number): Promise<ScheduleItem[]> {
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
          userId,
          startDate: Between(startOfDay, endOfDay),
        },
        {
          userId,
          endDate: Between(startOfDay, endOfDay),
        },
        {
          userId,
          startDate: LessThanOrEqual(startOfDay),
          endDate: MoreThanOrEqual(endOfDay),
        },
      ],
      order: { startDate: 'ASC' },
    });
  }
}
