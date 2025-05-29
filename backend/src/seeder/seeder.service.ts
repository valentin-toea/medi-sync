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
    // Ensure CNP is unique if provided, otherwise rely on email for existing check
    const existingUserCondition = userData.cnp
      ? [{ email: userData.email }, { cnp: userData.cnp }]
      : [{ email: userData.email }];

    let user = await this.userRepo.findOne({
      where: existingUserCondition,
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
      // Optionally update existing user details if needed (e.g., role, specialty)
      // For simplicity, this example doesn't update existing user details other than auth.
      // You might want to add: await this.userRepo.update(user.id, userData);
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
      }
    }
    return user;
  }

  async run() {
    console.log('🚀 Starting seeder run...');

    // --- Admin User (kept as is) ---
    const adminUser = await this.seedUser({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      cnp: '1880101987654', // Ensure this CNP is unique
      role: UserRole.ADMIN,
      specialty: 'Administration',
    });
    console.log(`Admin user: ${adminUser.email} seeded/verified.`);

    // --- Original Test Users (kept for now, as they are used later in the script) ---
    const medicUser = await this.seedUser({
      firstName: 'Maria', // Renamed slightly to avoid exact match if re-running
      lastName: 'Olteanu',
      email: 'medic@example.com',
      cnp: '1990101123456', // Original CNP
      role: UserRole.MEDIC,
      specialty: 'CARDIOLOGY', // Original specialty
      parafa: 'DR123',
      phone: '0712345678',
    });
    console.log(`Original Medic user: ${medicUser.email} seeded/verified.`);

    const rezidentUser = await this.seedUser({
      firstName: 'Stefan', // Renamed slightly
      lastName: 'Popescu',
      email: 'rezident@example.com',
      cnp: '2990101123457', // Original CNP
      role: UserRole.REZIDENT,
      specialty: 'CARDIOLOGY', // Original specialty
      phone: '0712345679',
    });
    console.log(
      `Original Rezident user: ${rezidentUser.email} seeded/verified.`,
    );

    const asistentUser = await this.seedUser({
      firstName: 'Laura', // Renamed slightly
      lastName: 'Tudor',
      email: 'asistent@example.com',
      cnp: '5030202345678', // Original CNP
      role: UserRole.ASISTENT,
      specialty: 'CARDIOLOGY', // Original specialty
      phone: '0712345680',
    });
    console.log(
      `Original Asistent user: ${asistentUser.email} seeded/verified.`,
    );

    // --- New Personnel Seeding ---
    console.log('🌱 Seeding new personnel based on specialties...');

    const specialties = [
      'PEDIATRICS',
      'DERMATOLOGY',
      'ORTHOPEDICS',
      'GENERAL SURGERY',
      'CARDIOLOGY',
      'ONCOLOGY',
    ];

    const firstNames = [
      'Mihai',
      'Elena',
      'Andrei',
      'Maria',
      'Victor',
      'Sofia',
      'Dan',
      'Irina',
      'Cosmin',
      'Adela',
      'Vlad',
      'Gabriela',
      'Cristina',
      'George',
      'Laura',
      'Stefan',
      'Ioan',
      'Diana',
      'Alexandru',
      'Bogdan',
      'Roxana',
      'Valentin',
    ];
    const lastNames = [
      'Popescu',
      'Ionescu',
      'Georgescu',
      'Dumitru',
      'Stancu',
      'Voicu',
      'Marin',
      'Constantin',
      'Barbu',
      'Lupu',
      'Stoica',
      'Radu',
      'Enescu',
      'Munteanu',
      'Pavel',
      'Sandu',
      'Dinu',
      'Chiriac',
      'Florescu',
      'Tudor',
      'Vancea',
      'Petrescu',
    ];

    let cnpCounter = 3000000000000; // Start CNPs from a new range for uniqueness
    let parafaCounter = 1000;
    let phoneCounter = 777000000;

    const generatedPersonnel: User[] = [];

    for (const specialty of specialties) {
      const specialtyShortCode = specialty.substring(0, 4).toUpperCase();

      // Seed Medics (Doctors)
      for (let i = 0; i < 4; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const personnelCnp = (cnpCounter++).toString();
        const personnelParafa = `${specialtyShortCode}${parafaCounter++}`;
        const personnelPhone = `0${phoneCounter++}`;

        generatedPersonnel.push(
          await this.seedUser({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${specialtyShortCode.toLowerCase()}${i}@example.com`,
            cnp: personnelCnp,
            role: UserRole.MEDIC,
            specialty,
            parafa: personnelParafa,
            phone: personnelPhone,
          }),
        );
      }

      // Seed Nurses (Asistenti)
      for (let i = 0; i < 6; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const personnelCnp = (cnpCounter++).toString();
        const personnelPhone = `0${phoneCounter++}`;

        generatedPersonnel.push(
          await this.seedUser({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.nurse.${specialtyShortCode.toLowerCase()}${i}@example.com`,
            cnp: personnelCnp,
            role: UserRole.ASISTENT, // Mapping Nurse to Asistent
            specialty,
            phone: personnelPhone,
          }),
        );
      }

      // Seed Residents
      for (let i = 0; i < 3; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const personnelCnp = (cnpCounter++).toString();
        const personnelPhone = `0${phoneCounter++}`;

        generatedPersonnel.push(
          await this.seedUser({
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.res.${specialtyShortCode.toLowerCase()}${i}@example.com`,
            cnp: personnelCnp,
            role: UserRole.REZIDENT,
            specialty,
            phone: personnelPhone,
          }),
        );
      }
    }
    console.log(
      `🌱 Successfully seeded/verified ${generatedPersonnel.length} new personnel records.`,
    );

    // --- Existing Seeding Logic for other entities (uses original test users) ---
    // (Make sure medicUser, rezidentUser, asistentUser are defined before this point if used)

    // --- Schedule Items (for original medicUser) ---
    if (medicUser) {
      const existingSchedules = await this.scheduleRepo.count({
        where: { user: { id: medicUser.id } },
      });
      if (existingSchedules === 0) {
        await this.scheduleRepo.save([
          {
            name: 'All day Duty',
            startDate: createTimeToday(0, 0),
            endDate: createTimeToday(23, 59),
            user: medicUser,
          },
          {
            name: 'Consults',
            startDate: createTimeTomorrow(8, 0),
            endDate: createTimeTomorrow(16, 59),
            user: medicUser,
          },
          {
            name: 'All day Duty',
            startDate: createTimeToday(0, 0),
            endDate: createTimeToday(23, 59),
            user: asistentUser,
          },
          {
            name: 'All Day Duty',
            startDate: createTimeToday(0, 0),
            endDate: createTimeToday(23, 59),
            user: rezidentUser,
          },
        ]);
        console.log(`Schedules seeded for original ${medicUser.email}`);
      }
    }

    // --- TimeLogs (for original medicUser) ---
    if (medicUser) {
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
        console.log(`TimeLogs seeded for original ${medicUser.email}`);
      }
    }

    // --- LeaveRequests (for original medicUser, approved by adminUser) ---
    if (medicUser && adminUser) {
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
            attachment: './uploads/attachments/medical_certificate.pdf', // Example path
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
        console.log(`LeaveRequests seeded for original ${medicUser.email}`);
      }
    }

    // --- Notifications (for original medicUser) ---
    if (medicUser) {
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
        console.log(`Notifications seeded for original ${medicUser.email}`);
      }
    }

    // --- OnCall & OnCallAssignments (uses original medicUser and asistentUser) ---
    if (medicUser && asistentUser) {
      const onCallCardiologyDate = createTimeTomorrow(0, 0);
      let onCallCardiology = await this.onCallRepo.findOne({
        where: { date: onCallCardiologyDate, specialty: 'CARDIOLOGY' }, // Assuming original medicUser is Cardiology
      });
      if (!onCallCardiology) {
        onCallCardiology = await this.onCallRepo.save({
          date: onCallCardiologyDate,
          specialty: medicUser.specialty, // Use specialty from original medicUser
          details: `Standard ${medicUser.specialty} on-call`,
          isStaffSufficient: false,
        });

        await this.onCallAssignmentRepo.save([
          {
            onCall: onCallCardiology,
            onCallId: onCallCardiology.id,
            user: medicUser,
            userId: medicUser.id,
            assignedRole: UserRole.MEDIC,
            startTime: '00:00:00',
            endTime: '23:59:00',
          },
          {
            onCall: onCallCardiology,
            onCallId: onCallCardiology.id,
            user: asistentUser,
            userId: asistentUser.id,
            assignedRole: UserRole.ASISTENT,
            startTime: '00:00:00',
            endTime: '23:59:00',
          },
          {
            onCall: onCallCardiology,
            onCallId: onCallCardiology.id,
            user: rezidentUser, // Use original rezidentUser
            userId: rezidentUser.id,
            assignedRole: UserRole.REZIDENT,
            startTime: '00:00:00',
            endTime: '23:59:00',
          },
        ]);
        onCallCardiology.isStaffSufficient = true;
        await this.onCallRepo.save(onCallCardiology);
        console.log(
          `OnCall and Assignments seeded for ${medicUser.specialty} on ${onCallCardiologyDate.toISOString().split('T')[0]}`,
        );
      }

      // --- OnCallSwap (original medicUser requests swap for their OnCallAssignment) ---
      const medicAssignment = await this.onCallAssignmentRepo.findOne({
        where: { onCallId: onCallCardiology?.id, userId: medicUser.id },
        relations: ['onCall'],
      });

      if (medicAssignment && rezidentUser) {
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
            potentialReplacements: [rezidentUser],
            status: OnCallSwapStatus.PENDING,
          });
          console.log(`OnCallSwap seeded for original ${medicUser.email}`);
        }
      }
    }

    // --- Internships (uses original medicUser and rezidentUser) ---
    if (medicUser && rezidentUser) {
      const existingInternships = await this.internshipRepo.count();
      if (existingInternships === 0) {
        // This check might need to be more specific if you add more internships
        const cardioInternship = await this.internshipRepo.save({
          name: `${medicUser.specialty} Basics`, // Use specialty from original medicUser
          description: `Introduction to ${medicUser.specialty} practices.`,
          startDate: createTimeToday(0, 0),
          endDate: new Date(
            createTimeToday(0, 0).getTime() + 30 * 24 * 60 * 60 * 1000,
          ), // 30 days
          coordinator: medicUser,
          coordinatorId: medicUser.id,
          location: 'Hospital Ward A',
          numberOfHours: 160,
          minimumProcedures: 10,
          testDate: new Date(
            createTimeToday(0, 0).getTime() + 35 * 24 * 60 * 60 * 1000,
          ),
        });
        console.log(`${medicUser.specialty} Internship seeded.`);

        // --- InternshipApplications (original rezidentUser applies) ---
        const existingApplications = await this.internshipApplicationRepo.count(
          {
            where: {
              userId: rezidentUser.id,
              internshipId: cardioInternship.id,
            },
          },
        );
        if (existingApplications === 0) {
          await this.internshipApplicationRepo.save({
            user: rezidentUser,
            userId: rezidentUser.id,
            internship: cardioInternship,
            internshipId: cardioInternship.id,
            status: InternshipApplicationStatus.APPROVED,
          });
          console.log(
            `InternshipApplication seeded for original ${rezidentUser.email} to ${cardioInternship.name}`,
          );
        }
      }
    }

    console.log('✅ Seeder run complete.');
  }
}
