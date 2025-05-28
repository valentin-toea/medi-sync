import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveRequestStatus } from './leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leaverequest.dto';
import { UpdateLeaveRequestStatusDto } from './dto/update-leaverequest-status.dto';
import { User } from '../user/user.entity';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const user = await this.userRepository.findOneBy({
      id: createLeaveRequestDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createLeaveRequestDto.userId} not found.`,
      );
    }
    const leaveRequest = this.leaveRequestRepository.create({
      ...createLeaveRequestDto,
      user, // Link the user object
      startDate: new Date(createLeaveRequestDto.startDate),
      endDate: new Date(createLeaveRequestDto.endDate),
      status: LeaveRequestStatus.PENDING,
    });
    return this.leaveRequestRepository.save(leaveRequest);
  }

  async findByUserId(userId: number): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  async updateStatus(
    leaveRequestId: number,
    updateDto: UpdateLeaveRequestStatusDto,
    adminUserId: number,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOneBy({
      id: leaveRequestId,
    });
    if (!leaveRequest) {
      throw new NotFoundException(
        `Leave request with ID ${leaveRequestId} not found.`,
      );
    }

    const adminUser = await this.userRepository.findOneBy({ id: adminUserId });
    if (!adminUser) {
      throw new NotFoundException(
        `Admin user with ID ${adminUserId} not found.`,
      );
    }

    leaveRequest.status = updateDto.status;
    if (updateDto.status === LeaveRequestStatus.REJECTED) {
      leaveRequest.rejectionReason = updateDto.rejectionReason ?? '';
    } else {
      leaveRequest.rejectionReason = '';
    }
    leaveRequest.approvedBy = adminUser;
    leaveRequest.approvedById = adminUser.id;
    leaveRequest.approvedAt = new Date();

    return this.leaveRequestRepository.save(leaveRequest);
  }
}
