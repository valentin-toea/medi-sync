import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnCallService } from './on-call.service';
import { OnCallController } from './on-call.controller';
import { OnCall } from './on-call.entity';
import { OnCallAssignment } from './on-call-assignment.entity';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnCall, OnCallAssignment, User]),
    AuthModule,
  ],
  controllers: [OnCallController],
  providers: [OnCallService],
  exports: [OnCallService], // Export if OnCallSwapService needs it
})
export class OnCallModule {}
