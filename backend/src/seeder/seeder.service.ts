/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// backend/src/seeder/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleItem } from 'src/schedule/schedule-item.entity';
import { User, UserRole } from 'src/user/user.entity';
import { Auth } from 'src/auth/auth.entity';
import { TimeLog, TimeLogStatus } from 'src/timelog/timelog.entity';
import {
  LeaveRequest,
  LeaveRequestStatus,
  LeaveRequestType,
} from 'src/leave-request/leave-request.entity';
import { Notification } from 'src/notification/notification.entity';
import { OnCall } from 'src/on-call/on-call.entity';
import { OnCallAssignment } from 'src/on-call/on-call-assignment.entity';
import {
  OnCallSwap,
  OnCallSwapStatus,
} from 'src/on-call-swap/on-call-swap.entity';
import { Internship } from 'src/internship/internship.entity';
import {
  InternshipApplication,
  InternshipApplicationStatus,
} from 'src/internship/internship-application.entity';
import * as bcrypt from 'bcrypt';
import {
  createTimeToday,
  createTimeTomorrow,
  createTimeYesterday,
} from './utils';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ScheduleItem)
    private scheduleRepo: Repository<ScheduleItem>,
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    @InjectRepository(TimeLog)
    private timeLogRepo: Repository<TimeLog>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepo: Repository<LeaveRequest>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(OnCall)
    private onCallRepo: Repository<OnCall>,
    @InjectRepository(OnCallAssignment)
    private onCallAssignmentRepo: Repository<OnCallAssignment>,
    @InjectRepository(OnCallSwap)
    private onCallSwapRepo: Repository<OnCallSwap>,
    @InjectRepository(Internship)
    private internshipRepo: Repository<Internship>,
    @InjectRepository(InternshipApplication)
    private internshipApplicationRepo: Repository<InternshipApplication>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async seedUser(
    userData: Partial<User>,
    authPassword = 'password',
  ): Promise<User> {
    let user = await this.userRepo.findOne({
      where: [{ email: userData.email }, { cnp: userData.cnp }],
    });
    if (!user) {
      user = await this.userRepo.save(this.userRepo.create(userData));
      const hashedPassword = await this.hashPassword(authPassword);
      await this.authRepo.save(
        this.authRepo.create({
          userId: user.id,
          email: user.email,
          passwordHash: hashedPassword,
        }),
      );
      console.log(`User ${user.email} created with default password.`);
    } else {
      const authEntry = await this.authRepo.findOne({
        where: { userId: user.id },
      });
      if (!authEntry) {
        const hashedPassword = await this.hashPassword(authPassword);
        await this.authRepo.save(
          this.authRepo.create({
            userId: user.id,
            email: user.email,
            passwordHash: hashedPassword,
          }),
        );
        console.log(`Auth entry created for existing user ${user.email}.`);
      } else {
        // Optionally update password if it's different
        // const isSamePassword = await bcrypt.compare(authPassword, authEntry.passwordHash);
        // if (!isSamePassword) {
        //   authEntry.passwordHash = await this.hashPassword(authPassword);
        //   await this.authRepo.save(authEntry);
        //   console.log(`Password updated for user ${user.email}.`);
        // }
      }
    }
    return user;
  }

  async run() {
    // --- Users & Auth ---
    const medicUser = await this.seedUser({
      firstName: 'Test',
      lastName: 'Medic',
      email: 'medic@example.com',
      cnp: '1990101123456',
      role: UserRole.MEDIC,
      specialty: 'Cardiology',
      parafa: 'DR123',
      phone: '0712345678',
    });

    const adminUser = await this.seedUser({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      cnp: '1880101987654',
      role: UserRole.ADMIN,
      specialty: 'Administration',
    });

    const rezidentUser = await this.seedUser({
      firstName: 'Test',
      lastName: 'Rezident',
      email: 'rezident@example.com',
      cnp: '2990101123457', // Different CNP
      role: UserRole.REZIDENT,
      specialty: 'General Practice',
      phone: '0712345679',
    });

    const asistentUser = await this.seedUser({
      firstName: 'Test',
      lastName: 'Asistent',
      email: 'asistent@example.com',
      cnp: '5030202345678', // Different CNP
      role: UserRole.ASISTENT,
      specialty: 'Nursing',
      phone: '0712345680',
    });

    // --- Schedule Items (for medicUser) ---
    const existingSchedules = await this.scheduleRepo.count({
      where: { user: { id: medicUser.id } },
    });
    if (existingSchedules === 0) {
      await this.scheduleRepo.save([
        {
          name: 'Night Rounds',
          startDate: createTimeYesterday(22, 0),
          endDate: createTimeToday(8, 0),
          user: medicUser,
        },
        {
          name: 'Morning Rounds',
          startDate: createTimeToday(8, 0),
          endDate: createTimeToday(12, 0),
          user: medicUser,
        },
      ]);
      console.log(`Schedules seeded for ${medicUser.email}`);
    }

    // --- TimeLogs (for medicUser) ---
    const existingTimeLogs = await this.timeLogRepo.count({
      where: { userId: medicUser.id },
    });
    if (existingTimeLogs === 0) {
      await this.timeLogRepo.save([
        {
          user: medicUser,
          userId: medicUser.id,
          date: createTimeYesterday(0, 0), // For yesterday
          checkIn: createTimeYesterday(8, 0),
          checkOut: createTimeYesterday(16, 0),
          gpsLocationCheckIn: '44.435, 26.100',
          gpsLocationCheckOut: '44.435, 26.100',
          status: TimeLogStatus.VALID,
        },
        {
          user: medicUser,
          userId: medicUser.id,
          date: createTimeToday(0, 0), // For today
          checkIn: createTimeToday(9, 0),
          status: TimeLogStatus.PENDING, // Still checked in
          gpsLocationCheckIn: '44.436, 26.101',
        },
      ]);
      console.log(`TimeLogs seeded for ${medicUser.email}`);
    }

    // --- LeaveRequests (for medicUser, approved by adminUser) ---
    const existingLeaveRequests = await this.leaveRequestRepo.count({
      where: { userId: medicUser.id },
    });
    if (existingLeaveRequests === 0) {
      await this.leaveRequestRepo.save([
        {
          user: medicUser,
          userId: medicUser.id,
          startDate: createTimeTomorrow(0, 0),
          endDate: new Date(
            createTimeTomorrow(0, 0).getTime() + 5 * 24 * 60 * 60 * 1000,
          ), // 5 days later
          type: LeaveRequestType.ANNUAL_LEAVE,
          status: LeaveRequestStatus.APPROVED,
          approvedBy: adminUser,
          approvedById: adminUser.id,
          approvedAt: new Date(),
        },
        {
          user: medicUser,
          userId: medicUser.id,
          startDate: new Date(
            createTimeTomorrow(0, 0).getTime() + 10 * 24 * 60 * 60 * 1000,
          ),
          endDate: new Date(
            createTimeTomorrow(0, 0).getTime() + 12 * 24 * 60 * 60 * 1000,
          ),
          type: LeaveRequestType.MEDICAL_LEAVE,
          status: LeaveRequestStatus.PENDING,
          attachment: './uploads/attachments/medical_certificate.pdf', // Example path
        },
      ]);
      console.log(`LeaveRequests seeded for ${medicUser.email}`);
    }

    // --- Notifications (for medicUser) ---
    const existingNotifications = await this.notificationRepo.count({
      where: { userId: medicUser.id },
    });
    if (existingNotifications === 0) {
      await this.notificationRepo.save([
        {
          user: medicUser,
          userId: medicUser.id,
          title: 'Welcome!',
          message: 'Welcome to the platform, check your schedule.',
          isRead: false,
        },
        {
          user: medicUser,
          userId: medicUser.id,
          title: 'Leave Request Update',
          message: 'Your annual leave has been approved.',
          isRead: true,
          readAt: new Date(),
        },
      ]);
      console.log(`Notifications seeded for ${medicUser.email}`);
    }

    // --- OnCall & OnCallAssignments ---
    const onCallCardiologyDate = createTimeTomorrow(0, 0);
    let onCallCardiology = await this.onCallRepo.findOne({
      where: { date: onCallCardiologyDate, specialty: 'Cardiology' },
    });
    if (!onCallCardiology) {
      onCallCardiology = await this.onCallRepo.save({
        date: onCallCardiologyDate,
        specialty: 'Cardiology',
        details: 'Standard cardiology on-call',
        isStaffSufficient: false, // Will be updated by assignments
      });

      await this.onCallAssignmentRepo.save([
        {
          onCall: onCallCardiology,
          onCallId: onCallCardiology.id,
          user: medicUser,
          userId: medicUser.id,
          assignedRole: 'Medic Primar',
          startTime: '08:00:00',
          endTime: '20:00:00',
        },
        {
          onCall: onCallCardiology,
          onCallId: onCallCardiology.id,
          user: asistentUser, // Assistant for the same shift
          userId: asistentUser.id,
          assignedRole: 'Asistent Medical',
          startTime: '08:00:00',
          endTime: '20:00:00',
        },
      ]);
      onCallCardiology.isStaffSufficient = true; // Assuming 2 staff are sufficient
      await this.onCallRepo.save(onCallCardiology);
      console.log(
        `OnCall and Assignments seeded for Cardiology on ${onCallCardiologyDate.toISOString().split('T')[0]}`,
      );
    }

    // --- OnCallSwap (medicUser requests swap for their OnCallAssignment) ---
    // First, ensure the assignment to swap exists
    const medicAssignment = await this.onCallAssignmentRepo.findOne({
      where: { onCallId: onCallCardiology?.id, userId: medicUser.id },
      relations: ['onCall'],
    });

    if (medicAssignment) {
      const existingSwaps = await this.onCallSwapRepo.count({
        where: {
          onCallId: medicAssignment.onCallId,
          requesterId: medicUser.id,
        },
      });
      if (existingSwaps === 0) {
        await this.onCallSwapRepo.save({
          onCall: medicAssignment.onCall,
          onCallId: medicAssignment.onCallId,
          requester: medicUser,
          requesterId: medicUser.id,
          potentialReplacements: [rezidentUser], // Rezident can potentially replace
          status: OnCallSwapStatus.PENDING,
        });
        console.log(`OnCallSwap seeded for ${medicUser.email}`);
      }
    }

    // --- Internships ---
    const existingInternships = await this.internshipRepo.count();
    if (existingInternships === 0) {
      const cardioInternship = await this.internshipRepo.save({
        name: 'Cardiology Basics',
        description: 'Introduction to cardiology practices.',
        startDate: createTimeToday(0, 0),
        endDate: new Date(
          createTimeToday(0, 0).getTime() + 30 * 24 * 60 * 60 * 1000,
        ), // 30 days
        coordinator: medicUser, // MedicUser coordinates
        coordinatorId: medicUser.id,
        location: 'Hospital Ward A',
        numberOfHours: 160,
        minimumProcedures: 10,
        testDate: new Date(
          createTimeToday(0, 0).getTime() + 35 * 24 * 60 * 60 * 1000,
        ),
      });
      console.log('Cardiology Internship seeded.');

      // --- InternshipApplications (rezidentUser applies for cardioInternship) ---
      const existingApplications = await this.internshipApplicationRepo.count({
        where: { userId: rezidentUser.id, internshipId: cardioInternship.id },
      });
      if (existingApplications === 0) {
        await this.internshipApplicationRepo.save({
          user: rezidentUser,
          userId: rezidentUser.id,
          internship: cardioInternship,
          internshipId: cardioInternship.id,
          status: InternshipApplicationStatus.APPROVED, // Auto-approve for seeder
        });
        console.log(
          `InternshipApplication seeded for ${rezidentUser.email} to ${cardioInternship.name}`,
        );
      }
    }

    console.log('✅ Seeder run complete.');
  }
}
