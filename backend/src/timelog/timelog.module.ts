import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLogService } from './timelog.service';
import { TimeLogController } from './timelog.controller';
import { TimeLog } from './timelog.entity';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard

@Module({
  imports: [TypeOrmModule.forFeature([TimeLog, User]), AuthModule],
  controllers: [TimeLogController],
  providers: [TimeLogService],
})
export class TimelogModule {}
