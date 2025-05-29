import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OnCall } from './on-call.entity';
import { OnCallAssignment } from './on-call-assignment.entity';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.entity';

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

  async autoAssignUserToOnCall(
    userId: number,
    dateStr: string,
  ): Promise<OnCall> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // Parse date and set to start of day
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    // 1. Find or create OnCall for date and user's specialty
    let onCall = await this.onCallRepository.findOne({
      where: { date, specialty: user.specialty },
      relations: ['assignments', 'assignments.user'],
    });
    if (!onCall) {
      onCall = this.onCallRepository.create({
        date,
        specialty: user.specialty,
        details: '',
        isStaffSufficient: false,
      });
      onCall = await this.onCallRepository.save(onCall);
    }

    // 2. Create OnCallAssignment for this user if not already assigned
    let assignment = await this.onCallAssignmentRepository.findOne({
      where: { onCallId: onCall.id, userId: user.id },
    });
    if (!assignment) {
      assignment = this.onCallAssignmentRepository.create({
        onCall,
        onCallId: onCall.id,
        user,
        userId: user.id,
        assignedRole: user.role,
        startTime: '00:00:00',
        endTime: '23:59:00',
      });
      await this.onCallAssignmentRepository.save(assignment);
    }

    // 3. Check if we have 1 medic, 1 rezident, 1 asistent
    const assignments = await this.onCallAssignmentRepository.find({
      where: { onCallId: onCall.id },
      relations: ['user'],
    });
    const roles = assignments.map((a) => a.user.role);
    const hasMedic = roles.includes(UserRole.MEDIC);
    const hasRezident = roles.includes(UserRole.REZIDENT);
    const hasAsistent = roles.includes(UserRole.ASISTENT);

    onCall.isStaffSufficient = hasMedic && hasRezident && hasAsistent;
    await this.onCallRepository.save(onCall);

    // Return updated onCall with assignments
    const updatedOnCall = await this.onCallRepository.findOne({
      where: { id: onCall.id },
      relations: ['assignments', 'assignments.user'],
    });
    if (!updatedOnCall) {
      throw new NotFoundException('OnCall not found after assignment');
    }
    return updatedOnCall;
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
      let dateObj: Date;
      if (slot.date instanceof Date) {
        dateObj = slot.date;
      } else {
        dateObj = new Date(slot.date);
      }
      const dateStr = dateObj.toISOString().split('T')[0];
      if (!calendar[dateStr]) {
        calendar[dateStr] = {
          data: dateStr,
          specialitati: [],
        };
      }
      calendar[dateStr].specialitati.push({
        specialitate: slot.specialty,
        personal_suficient: slot.isStaffSufficient,
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
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const onCall = await this.onCallRepository.findOne({
      where: {
        specialty,
      },
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
      id: onCall.id,
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

  // ...existing code...

  async getUserOnCallDaysForMonth(
    userId: number,
    monthYear: string,
  ): Promise<{ days: string[] }> {
    const [year, month] = monthYear.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Find all assignments for this user in the given month
    const assignments = await this.onCallAssignmentRepository.find({
      where: {
        userId,
      },
      relations: ['onCall'],
    });

    // Filter assignments to those within the month
    const daysSet = new Set<string>();
    assignments.forEach((assignment) => {
      const onCallDate =
        assignment.onCall?.date instanceof Date
          ? assignment.onCall.date
          : new Date(assignment.onCall?.date);
      if (onCallDate >= startDate && onCallDate <= endDate) {
        daysSet.add(onCallDate.toISOString().split('T')[0]);
      }
    });

    return { days: Array.from(daysSet) };
  }

  async getOnCallDetailsById(onCallId: number): Promise<any> {
    const onCall = await this.onCallRepository.findOne({
      where: { id: onCallId },
      relations: ['assignments', 'assignments.user'],
    });

    if (!onCall) {
      throw new NotFoundException(
        `On-call entry with id ${onCallId} not found.`,
      );
    }

    return {
      id: onCall.id,
      date: onCall.date,
      specialty: onCall.specialty,
      details: onCall.details,
      isStaffSufficient: onCall.isStaffSufficient,
      assignments: onCall.assignments.map((a) => ({
        id: a.user.id,
        name: `${a.user.lastName} ${a.user.firstName}`,
        role: a.user.role,
        parafa: a.user.parafa,
        specialty: a.user.specialty,
        assignmentId: a.id,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    };
  }
}
