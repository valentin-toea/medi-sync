// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // For JWT
import { PassportModule } from '@nestjs/passport'; // For JWT

import { setDatabase } from './set-db';
import { UsersModule } from './user/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SeederService } from './seeder/seeder.service';

import { User } from './user/user.entity';
import { ScheduleItem } from './schedule/schedule-item.entity';
import { Auth } from './auth/auth.entity';
import { TimeLog } from './timelog/timelog.entity';
import { LeaveRequest } from './leave-request/leave-request.entity';
import { Notification } from './notification/notification.entity';
import { OnCall } from './on-call/on-call.entity';
import { OnCallAssignment } from './on-call/on-call-assignment.entity';
import { OnCallSwap } from './on-call-swap/on-call-swap.entity';
import { Internship } from './internship/internship.entity';
import { InternshipApplication } from './internship/internship-application.entity';

// Import new modules (shells will be created later)
import { AuthModule } from './auth/auth.module';
import { TimelogModule } from './timelog/timelog.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';
import { NotificationModule } from './notification/notification.module';
import { OnCallModule } from './on-call/on-call.module';
import { OnCallSwapModule } from './on-call-swap/on-call-swap.module';
import { InternshipModule } from './internship/internship.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PassportModule, // Add PassportModule
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    JwtModule.registerAsync({
      // Configure JWT
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'yourSecretKey'), // Use env var
        signOptions: { expiresIn: '1h' }, // Token expiration
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: setDatabase,
    }),
    // Register all entities needed by the SeederService directly or ensure they are exported by their modules
    TypeOrmModule.forFeature([
      User,
      ScheduleItem,
      Auth,
      TimeLog,
      LeaveRequest,
      Notification,
      OnCall,
      OnCallAssignment,
      OnCallSwap,
      Internship,
      InternshipApplication,
    ]),
    UsersModule,
    AuthModule, // Import AuthModule
    ScheduleModule,
    TimelogModule,
    LeaveRequestModule,
    NotificationModule,
    OnCallModule,
    OnCallSwapModule,
    InternshipModule,
  ],
  providers: [SeederService], // SeederService is kept here for now
  exports: [TypeOrmModule], // Export TypeOrmModule if entities are used in other modules not explicitly importing them
})
export class AppModule {}
