import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

    // Get the date to match (either from DTO or today)
    const baseDate = createTimeLogDto.date
      ? new Date(createTimeLogDto.date)
      : new Date();

    // Set start and end of the day
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingCheckIn = await this.timeLogRepository.findOne({
      where: {
        userId: createTimeLogDto.userId,
        date: Between(startOfDay, endOfDay),
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
        date: baseDate,
        status: TimeLogStatus.PENDING, // Or derive based on schedule
      });
    }

    timeLogEntry.checkIn = new Date(createTimeLogDto.checkInTime);
    timeLogEntry.gpsLocationCheckIn = createTimeLogDto.gpsLocationCheckIn;
    // TODO: check gpsLocationCheckIn for validity if needed

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

    // Get the date to match (either from DTO or today)
    const baseDate = new Date();

    // Set start and end of the day
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const timeLogEntry = await this.timeLogRepository.findOne({
      where: {
        userId: checkOutDto.userId,
        date: Between(startOfDay, endOfDay),
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
    // TODO: check gpsLocationCheckIn for validity if needed

    return this.timeLogRepository.save(timeLogEntry);
  }

  async findByUserIdAndDate(
    userId: number,
    date: string,
  ): Promise<TimeLog | null> {
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);
    return this.timeLogRepository.findOne({
      where: {
        userId,
        date: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });
  }
}
