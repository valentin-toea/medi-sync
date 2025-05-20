// src/schedule/schedule.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleItem } from './schedule-item.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleItem])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
