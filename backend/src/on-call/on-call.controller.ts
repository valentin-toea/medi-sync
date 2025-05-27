import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OnCallService } from './on-call.service';
import { GetOnCallCalendarDto } from './dto/get-on-call-calendar.dto';
import { CreateOnCallDto } from './dto/create-on-call.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Controller('api/garda')
@UseGuards(JwtAuthGuard)
export class OnCallController {
  constructor(private readonly onCallService: OnCallService) {}

  @Get()
  async getCalendarByMonth(
    @Query() query: GetOnCallCalendarDto,
  ): Promise<ReturnType<OnCallService['getCalendarByMonth']>> {
    return this.onCallService.getCalendarByMonth(query.luna);
  }

  @Get(':data/:specialitate')
  async getDetailsByDateAndSpecialty(
    @Param('data') date: string, // YYYY-MM-DD
    @Param('specialitate') specialty: string,
  ): Promise<ReturnType<OnCallService['getDetailsByDateAndSpecialty']>> {
    return this.onCallService.getDetailsByDateAndSpecialty(date, specialty);
  }

  // Example Admin route to create/update an on-call slot
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can define on-call slots
  @HttpCode(HttpStatus.CREATED)
  async createOrUpdateOnCallSlot(@Body() createOnCallDto: CreateOnCallDto) {
    return this.onCallService.createOrUpdateOnCall(createOnCallDto);
  }
}
