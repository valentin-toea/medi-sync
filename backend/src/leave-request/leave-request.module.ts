import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express'; // For file uploads
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestController } from './leave-request.controller';
import { LeaveRequest } from './leave-request.entity';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, User]),
    MulterModule.register({
      dest: './uploads/attachments', // Default destination if not overridden in interceptor
    }),
    AuthModule,
  ],
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService],
})
export class LeaveRequestModule {}
