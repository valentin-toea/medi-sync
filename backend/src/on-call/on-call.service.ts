import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OnCall } from './on-call.entity';
import { OnCallAssignment } from './on-call-assignment.entity';
import { User } from '../user/user.entity';
import { CreateOnCallDto } from './dto/create-on-call.dto';

@Injectable()
export class OnCallService {
  constructor(
    @InjectRepository(OnCall)
    private onCallRepository: Repository<OnCall>,
    @InjectRepository(OnCallAssignment)
    private onCallAssignmentRepository: Repository<OnCallAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrUpdateOnCall(dto: CreateOnCallDto): Promise<OnCall> {
    let onCall = await this.onCallRepository.findOne({
      where: { date: new Date(dto.date), specialty: dto.specialty },
    });

    if (onCall) {
      // Update existing
      onCall.details = dto.details ?? onCall.details;
      onCall.isStaffSufficient =
        dto.isStaffSufficient ?? onCall.isStaffSufficient;
    } else {
      // Create new
      onCall = this.onCallRepository.create({
        date: new Date(dto.date),
        specialty: dto.specialty,
        details: dto.details,
        isStaffSufficient: dto.isStaffSufficient ?? false,
      });
    }
    const savedOnCall = await this.onCallRepository.save(onCall);

    if (dto.assignments) {
      // Clear existing assignments for this onCall if updating
      await this.onCallAssignmentRepository.delete({
        onCallId: savedOnCall.id,
      });
      for (const assignmentDto of dto.assignments) {
        const user = await this.userRepository.findOneBy({
          id: assignmentDto.userId,
        });
        if (user) {
          const assignment = this.onCallAssignmentRepository.create({
            ...assignmentDto,
            onCall: savedOnCall,
            user,
          });
          await this.onCallAssignmentRepository.save(assignment);
        }
      }
    }
    const result = await this.onCallRepository.findOne({
      where: { id: savedOnCall.id },
      relations: ['assignments', 'assignments.user'],
    });
    if (!result) {
      throw new NotFoundException(
        `On-call with id ${savedOnCall.id} not found after save.`,
      );
    }
    return result;
  }

  async getCalendarByMonth(monthYear: string): Promise<any> {
    // monthYear is YYYY-MM
    const [year, month] = monthYear.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    const onCallSlots = await this.onCallRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['assignments', 'assignments.user'], // To check staff sufficiency
      order: { date: 'ASC', specialty: 'ASC' },
    });

    // Group by date, then by specialty to create the desired response structure
    type CalendarDay = {
      data: string;
      specialitati: Array<{
        specialitate: string;
        personal_suficient: boolean;
      }>;
    };
    const calendar: { [date: string]: CalendarDay } = {};
    onCallSlots.forEach((slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];
      if (!calendar[dateStr]) {
        calendar[dateStr] = {
          data: dateStr,
          specialitati: [],
        };
      }
      // For simplicity, isStaffSufficient is taken directly.
      // Real logic might involve checking number of assignments vs. a requirement.
      calendar[dateStr].specialitati.push({
        specialitate: slot.specialty,
        personal_suficient: slot.isStaffSufficient,
        // You might want to count actual assigned personnel here
        // personal_count: slot.assignments.length
      });
    });

    return {
      luna: monthYear,
      zile: Object.values(calendar),
    };
  }

  async getDetailsByDateAndSpecialty(
    date: string,
    specialty: string,
  ): Promise<any> {
    const onCall = await this.onCallRepository.findOne({
      where: { date: new Date(date), specialty },
      relations: ['assignments', 'assignments.user'],
    });

    if (!onCall) {
      throw new NotFoundException(
        `On-call slot for ${specialty} on ${date} not found.`,
      );
    }

    // Assuming one main program interval for the on-call specialty for that day
    // This might need to be more dynamic based on how assignments store times
    let programInterval = 'N/A';
    if (onCall.assignments && onCall.assignments.length > 0) {
      const firstAssignment = onCall.assignments[0];
      if (firstAssignment.startTime && firstAssignment.endTime) {
        programInterval = `${firstAssignment.startTime}-${firstAssignment.endTime}`;
      } else {
        // Fallback if specific shift times aren't set per assignment, could use a default
        programInterval = '08:00-20:00'; // Example default
      }
    }

    return {
      data: date,
      specialitate: onCall.specialty,
      detalii: {
        program: programInterval,
        personal_suficient: onCall.isStaffSufficient,
        detalii_generale: onCall.details,
        personal: onCall.assignments.map((a) => ({
          id: a.user.id,
          nume: `${a.user.lastName} ${a.user.firstName}`,
          rol: a.user.role, // Or a.assignedRole if more specific
          parafa: a.user.parafa,
          specialitate_medic: a.user.specialty,
        })),
      },
    };
  }
}
