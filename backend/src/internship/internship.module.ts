import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { Internship } from './internship.entity';
import { InternshipApplication } from './internship-application.entity';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Internship, InternshipApplication, User]),
    AuthModule,
  ],
  controllers: [InternshipController],
  providers: [InternshipService],
})
export class InternshipModule {}
