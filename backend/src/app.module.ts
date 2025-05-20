import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { setDatabase } from './set-db';
import { UsersModule } from './user/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SeederService } from './seeder/seeder.service';
import { User } from './user/user.entity';
import { ScheduleItem } from './schedule/schedule-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: setDatabase,
    }),
    TypeOrmModule.forFeature([User, ScheduleItem]),
    UsersModule,
    ScheduleModule,
  ],
  providers: [SeederService],
})
export class AppModule {}
