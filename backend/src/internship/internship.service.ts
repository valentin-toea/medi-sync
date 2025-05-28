import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internship } from './internship.entity';
import {
  InternshipApplication,
  InternshipApplicationStatus,
} from './internship-application.entity';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { User, UserRole } from '../user/user.entity';

@Injectable()
export class InternshipService {
  constructor(
    @InjectRepository(Internship)
    private internshipRepository: Repository<Internship>,
    @InjectRepository(InternshipApplication)
    private applicationRepository: Repository<InternshipApplication>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createInternship(dto: CreateInternshipDto): Promise<Internship> {
    const internship = this.internshipRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      ...(dto.testDate ? { testDate: new Date(dto.testDate) } : {}),
    });
    // Handle coordinatorId if linking to a User entity
    if (dto.coordinatorId) {
      const coordinator = await this.userRepository.findOneBy({
        id: dto.coordinatorId,
      });
      if (!coordinator || coordinator.role !== UserRole.MEDIC) {
        // Assuming coordinators must be medics
        throw new NotFoundException(
          `Coordinator (User ID ${dto.coordinatorId}) not found or is not a medic.`,
        );
      }
      internship.coordinator = coordinator;
    }
    return this.internshipRepository.save(internship);
  }

  async findOne(internshipId: number): Promise<Internship> {
    const internship = await this.internshipRepository.findOne({
      where: { id: internshipId },
      relations: ['coordinator'], // Load coordinator details
    });
    if (!internship) {
      throw new NotFoundException(
        `Internship with ID ${internshipId} not found.`,
      );
    }
    return internship;
  }

  async getInternshipsForUser(userId: number): Promise<{
    stagii_curente: {
      id: number;
      denumire: string;
      perioada: string;
      medic_coordonator: string;
      loc_desfasurare: string;
      nr_ore: number;
      minim_proceduri: number;
      data_test: string;
    } | null;
    stagii_viitoare: any[];
  }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || user.role !== UserRole.REZIDENT) {
      // Assuming only residents apply for internships
      throw new NotFoundException(
        `User ${userId} is not a resident or not found.`,
      );
    }

    const now = new Date();
    const applications = await this.applicationRepository.find({
      where: { userId },
      relations: ['internship', 'internship.coordinator'],
      order: { internship: { startDate: 'ASC' } },
    });

    const currentInternshipsRaw = applications.filter(
      (app) =>
        app.internship.startDate <= now &&
        app.internship.endDate >= now &&
        app.status === InternshipApplicationStatus.APPROVED,
    );
    // For simplicity, taking the first current one. Real logic might differ.
    const currentInternship =
      currentInternshipsRaw.length > 0
        ? currentInternshipsRaw[0].internship
        : null;

    const futureInternships = applications
      .filter(
        (app) =>
          app.internship.startDate > now &&
          app.status === InternshipApplicationStatus.APPROVED,
      )
      .map((app) => ({
        id: app.internship.id,
        denumire: app.internship.name,
        detalii: `Starts on ${app.internship.startDate.toISOString().split('T')[0]}`, // Simplified details
      }));

    let currentInternshipFormatted: {
      id: number;
      denumire: string;
      perioada: string;
      medic_coordonator: string;
      loc_desfasurare: string;
      nr_ore: number;
      minim_proceduri: number;
      data_test: string;
    } | null = null;
    if (currentInternship) {
      currentInternshipFormatted = {
        id: currentInternship.id,
        denumire: currentInternship.name,
        perioada: `${currentInternship.startDate.toISOString().split('T')[0]} pana la ${currentInternship.endDate.toISOString().split('T')[0]}`,
        medic_coordonator: currentInternship.coordinator
          ? `${currentInternship.coordinator.firstName} ${currentInternship.coordinator.lastName}`
          : currentInternship.coordinatorName || 'N/A',
        loc_desfasurare: currentInternship.location,
        nr_ore: currentInternship.numberOfHours,
        minim_proceduri: currentInternship.minimumProcedures,
        data_test: currentInternship.testDate
          ? currentInternship.testDate.toISOString().split('T')[0]
          : 'N/A',
      };
    }

    return {
      stagii_curente: currentInternshipFormatted,
      stagii_viitoare: futureInternships,
    };
  }

  async applyForInternship(
    internshipId: number,
    userId: number,
  ): Promise<InternshipApplication> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || user.role !== UserRole.REZIDENT) {
      // Assuming only residents apply
      throw new NotFoundException(`Resident User ID ${userId} not found.`);
    }

    const internship = await this.internshipRepository.findOneBy({
      id: internshipId,
    });
    if (!internship) {
      throw new NotFoundException(`Internship ID ${internshipId} not found.`);
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { userId, internshipId },
    });
    if (existingApplication) {
      throw new ConflictException(
        'User has already applied for this internship.',
      );
    }

    const application = this.applicationRepository.create({
      user,
      userId,
      internship,
      internshipId,
      status: InternshipApplicationStatus.PENDING,
    });
    return this.applicationRepository.save(application);
  }
}
