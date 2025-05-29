import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { OnCallService } from './on-call.service';
import { GetOnCallCalendarDto } from './dto/get-on-call-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../user/user.entity';
import { Req } from '@nestjs/common';

@Controller('api/garda')
@UseGuards(JwtAuthGuard)
export class OnCallController {
  constructor(private readonly onCallService: OnCallService) {}

  @Get('my-days')
  async getMyOnCallDays(
    @Req() req: { user: { userId: number; role: UserRole } },
    @Query('month') month: string,
  ): Promise<{ days: string[] }> {
    const userId: number = req.user?.userId ?? 1;
    return this.onCallService.getUserOnCallDaysForMonth(userId, month);
  }

  @Get('details/:onCallId')
  async getOnCallDetails(
    @Param('onCallId') onCallId: number,
  ): Promise<ReturnType<OnCallService['getOnCallDetailsById']>> {
    return this.onCallService.getOnCallDetailsById(onCallId);
  }

  @Get(':data/:specialitate')
  async getDetailsByDateAndSpecialty(
    @Param('data') date: string, // YYYY-MM-DD
    @Param('specialitate') specialty: string,
  ): Promise<ReturnType<OnCallService['getDetailsByDateAndSpecialty']>> {
    return this.onCallService.getDetailsByDateAndSpecialty(date, specialty);
  }

  @Get()
  async getCalendarByMonth(
    @Query() query: GetOnCallCalendarDto,
  ): Promise<ReturnType<OnCallService['getCalendarByMonth']>> {
    return this.onCallService.getCalendarByMonth(query.luna);
  }

  // // Example Admin route to create/update an on-call slot
  // @Post()
  // @UseGuards(RolesGuard)
  // @HttpCode(HttpStatus.CREATED)
  // async createOrUpdateOnCallSlot(@Body() createOnCallDto: OnCallAssignmentDto) {
  //   return this.onCallService.createOrUpdateOnCall(createOnCallDto);
  // }
  // In your controller
  @Post('auto-assign')
  async autoAssign(
    @Body('userId') userId: number,
    @Body('date') date: string, // expects YYYY-MM-DD
  ) {
    return this.onCallService.autoAssignUserToOnCall(userId, date);
  }
}
