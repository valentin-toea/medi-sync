// src/seeder/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleItem } from 'src/schedule/schedule-item.entity';
import { User, UserRole } from 'src/user/user.entity';
import { Auth } from 'src/auth/auth.entity';
import * as bcrypt from 'bcrypt';
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
    @InjectRepository(Auth) // Inject AuthRepository
    private authRepo: Repository<Auth>,
  ) {}

  async run() {
    // --- User and Auth Seeding ---
    const existingUser = await this.userRepo.findOne({
      where: { email: 'test@example.com' },
    });

    let user = existingUser;

    if (!user) {
      user = await this.userRepo.save({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        cnp: '1990101123456',
        role: UserRole.MEDIC,
        specialty: 'Cardiology',
        parafa: 'DR123',
        phone: '0712345678',
      });

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('parola123', salt);

      await this.authRepo.save({
        userId: user.id,
        email: user.email,
        passwordHash: hashedPassword,
      });
    } else {
      // Ensure auth entry exists if user does
      const existingAuth = await this.authRepo.findOne({
        where: { userId: user.id },
      });
      if (!existingAuth) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('parola123', salt);
        await this.authRepo.save({
          userId: user.id,
          email: user.email,
          passwordHash: hashedPassword,
        });
      }
    }

    // --- Admin User ---
    const adminEmail = 'admin@example.com';
    let adminUser = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (!adminUser) {
      adminUser = await this.userRepo.save({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        cnp: '1880101987654',
        role: UserRole.ADMIN,
        specialty: 'Administration',
      });
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await this.authRepo.save({
        userId: adminUser.id,
        email: adminUser.email,
        passwordHash: hashedPassword,
      });
    }

    // --- Schedule Seeding ---
    const existingSchedules = await this.scheduleRepo.count({
      where: { userId: user.id },
    });
    if (existingSchedules === 0) {
      await this.scheduleRepo.save([
        {
          name: 'Night Rounds',
          startDate: createTimeYesterday(22, 0),
          endDate: createTimeToday(8, 0),
          user, // or userId: user.id
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
          name: 'Night Rounds Next Day',
          startDate: createTimeToday(22, 0),
          endDate: createTimeTomorrow(8, 0),
          user,
        },
      ]);
    }

    console.log('✅ Seeder run complete.');
  }
}
