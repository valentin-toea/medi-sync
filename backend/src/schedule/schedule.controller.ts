// src/schedule/schedule.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('user/:id')
  getScheduleByUser(@Param('id', ParseIntPipe) userId: number) {
    return this.scheduleService.findByUser(userId);
  }

  @Get('user/:id/today')
  getTodayScheduleByUser(@Param('id', ParseIntPipe) userId: number) {
    return this.scheduleService.findTodayByUser(userId);
  }
}
