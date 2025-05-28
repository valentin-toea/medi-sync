import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeLog, TimeLogStatus } from './timelog.entity';
import { User } from '../user/user.entity';
import { CreateTimeLogDto, CheckOutDto } from './dto/create-timelog.dto';

@Injectable()
export class TimeLogService {
  constructor(
    @InjectRepository(TimeLog)
    private timeLogRepository: Repository<TimeLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkIn(createTimeLogDto: CreateTimeLogDto): Promise<TimeLog> {
    const user = await this.userRepository.findOneBy({
      id: createTimeLogDto.userId,
    });
    if (!user) {
      throw new NotFoundException(`User #${createTimeLogDto.userId} not found`);
    }

    const today = createTimeLogDto.date
      ? new Date(createTimeLogDto.date)
      : new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await this.timeLogRepository.findOne({
      where: {
        userId: createTimeLogDto.userId,
        date: today,
      },
    });

    if (existingCheckIn?.checkIn) {
      throw new ConflictException('User has already checked in today.');
    }

    let timeLogEntry = existingCheckIn;
    if (!timeLogEntry) {
      timeLogEntry = this.timeLogRepository.create({
        user,
        userId: createTimeLogDto.userId,
        date: today,
        status: TimeLogStatus.PENDING, // Or derive based on schedule
      });
    }

    timeLogEntry.checkIn = new Date(createTimeLogDto.checkInTime);
    timeLogEntry.gpsLocationCheckIn = createTimeLogDto.gpsLocationCheckIn;
    // Potentially add logic to validate against user's schedule if needed

    return this.timeLogRepository.save(timeLogEntry);
  }

  async checkOut(checkOutDto: CheckOutDto): Promise<TimeLog> {
    const user = await this.userRepository.findOneBy({
      id: checkOutDto.userId,
    });
    if (!user) {
      throw new NotFoundException(`User #${checkOutDto.userId} not found`);
    }

    const today = new Date(); // Assume checkout is for the current day of the check-in
    today.setHours(0, 0, 0, 0);

    const timeLogEntry = await this.timeLogRepository.findOne({
      where: {
        userId: checkOutDto.userId,
        date: today, // find the entry for today
      },
    });

    if (!timeLogEntry) {
      throw new NotFoundException(
        'No check-in record found for today to check-out.',
      );
    }
    if (timeLogEntry.checkOut) {
      throw new ConflictException('User has already checked out today.');
    }

    timeLogEntry.checkOut = new Date(checkOutDto.checkOutTime);
    timeLogEntry.gpsLocationCheckOut = checkOutDto.gpsLocationCheckOut;
    timeLogEntry.status = TimeLogStatus.VALID; // Or PENDING_VALIDATION etc.

    return this.timeLogRepository.save(timeLogEntry);
  }

  async findByUserIdAndDate(
    userId: number,
    date: string,
  ): Promise<TimeLog | null> {
    const queryDate = new Date(date);
    return this.timeLogRepository.findOne({
      where: {
        userId,
        date: queryDate,
      },
      relations: ['user'],
    });
  }
}
