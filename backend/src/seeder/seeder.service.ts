import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleItem } from 'src/schedule/schedule-item.entity';
import { User } from 'src/user/user.entity';
import {
  createTimeToday,
  createTimeTomorrow,
  createTimeYesterday,
} from './utils';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ScheduleItem)
    private scheduleRepo: Repository<ScheduleItem>,
  ) {}

  async run() {
    const existingUser = await this.userRepo.findOne({
      where: { email: 'test@example.com' },
    });

    const user =
      existingUser ??
      (await this.userRepo.save({
        name: 'Test User',
        email: 'test@example.com',
      }));

    // Optional: prevent duplicate schedules on reseed
    await this.scheduleRepo.delete({ user: { id: user.id } });

    await this.scheduleRepo.save([
      {
        name: 'Night Rounds',
        startDate: createTimeYesterday(22, 0),
        endDate: createTimeToday(8, 0),
        user,
      },
      {
        name: 'Morning Rounds',
        startDate: createTimeToday(8, 0),
        endDate: createTimeToday(12, 0),
        user,
      },
      {
        name: 'Afternoon Rounds',
        startDate: createTimeToday(12, 0),
        endDate: createTimeToday(16, 0),
        user,
      },
      {
        name: 'Evening Rounds',
        startDate: createTimeToday(16, 0),
        endDate: createTimeToday(22, 0),
        user,
      },
      {
        name: 'Night Rounds',
        startDate: createTimeToday(22, 0),
        endDate: createTimeTomorrow(8, 0),
        user,
      },
    ]);

    console.log('✅ Seeder run complete.');
  }
}
