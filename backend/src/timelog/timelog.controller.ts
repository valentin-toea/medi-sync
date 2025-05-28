import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { TimeLogService } from './timelog.service';
import {
  CreateTimeLogDto,
  CheckOutDto,
  GetTimeLogQueryDto,
} from './dto/create-timelog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeLog } from './timelog.entity';

@Controller('api/pontaj')
@UseGuards(JwtAuthGuard)
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Get(':utilizator_id')
  async getTimeLogForDay(
    @Param('utilizator_id', ParseIntPipe) userId: number,
    @Query() query: GetTimeLogQueryDto,
  ): Promise<{ data: string; inregistrari: Partial<TimeLog> | null }> {
    const timeLog = await this.timeLogService.findByUserIdAndDate(
      userId,
      query.data,
    );
    let inregistrari = {};
    if (timeLog) {
      inregistrari = {
        check_in: timeLog.checkIn, // Ensure property names match response
        check_out: timeLog.checkOut,
        locatie_gps_checkin: timeLog.gpsLocationCheckIn,
        locatie_gps_checkout: timeLog.gpsLocationCheckOut,
        status: timeLog.status,
      };
    }
    return {
      data: query.data,
      inregistrari,
    };
  }

  @Get()
  async getTimeLogForDayCurrentUser(
    @Query() query: GetTimeLogQueryDto,
    @Req() req: import('express').Request & { user?: { id: number } }, // Typed req
  ): Promise<{ data: string; inregistrari: Partial<TimeLog> | null }> {
    const userIdFromReq = req.user?.id as number;
    const timeLog = await this.timeLogService.findByUserIdAndDate(
      userIdFromReq,
      query.data,
    );
    let inregistrari = {};
    if (timeLog) {
      inregistrari = {
        check_in: timeLog.checkIn, // Ensure property names match response
        check_out: timeLog.checkOut,
        locatie_gps_checkin: timeLog.gpsLocationCheckIn,
        locatie_gps_checkout: timeLog.gpsLocationCheckOut,
        status: timeLog.status,
      };
    }

    return {
      data: query.data,
      inregistrari,
    };
  }

  @Post('checkin')
  @HttpCode(HttpStatus.CREATED)
  async checkIn(
    @Body() createTimeLogDto: CreateTimeLogDto,
  ): Promise<{ mesaj: string; data: string }> {
    const timeLog = await this.timeLogService.checkIn(createTimeLogDto);
    return {
      mesaj: 'Check-in reușit',
      data: timeLog.checkIn.toISOString(),
    };
  }

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkOut(
    @Body() checkOutDto: CheckOutDto,
  ): Promise<{ mesaj: string; data: string }> {
    const timeLog = await this.timeLogService.checkOut(checkOutDto);
    return {
      mesaj: 'Check-out reușit',
      data: timeLog.checkOut.toISOString(),
    };
  }
}
