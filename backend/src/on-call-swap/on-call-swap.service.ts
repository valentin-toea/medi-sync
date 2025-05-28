import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnCallSwap, OnCallSwapStatus } from './on-call-swap.entity';
import { CreateOnCallSwapDto } from './dto/create-oncallswap.dto';
import { User } from '../user/user.entity';
import { OnCall } from '../on-call/on-call.entity';

@Injectable()
export class OnCallSwapService {
  constructor(
    @InjectRepository(OnCallSwap)
    private onCallSwapRepository: Repository<OnCallSwap>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OnCall)
    private onCallRepository: Repository<OnCall>,
  ) {}

  async createSwapRequest(
    date: string,
    specialty: string,
    dto: CreateOnCallSwapDto,
  ): Promise<OnCallSwap> {
    const requester = await this.userRepository.findOneBy({
      id: dto.solicitant_id,
    });
    if (!requester) {
      throw new NotFoundException(
        `Requester User ID ${dto.solicitant_id} not found.`,
      );
    }

    const onCallSlot = await this.onCallRepository.findOne({
      where: { date: new Date(date), specialty },
      relations: ['assignments'], // Check if requester is actually assigned
    });
    if (!onCallSlot) {
      throw new NotFoundException(
        `On-call slot for ${specialty} on ${date} not found.`,
      );
    }

    // Optional: Verify if the requester is actually assigned to this on-call slot
    // const isRequesterAssigned = onCallSlot.assignments.some(a => a.userId === dto.solicitant_id);
    // if (!isRequesterAssigned) {
    //   throw new ConflictException(`User ${dto.solicitant_id} is not assigned to this on-call slot.`);
    // }

    // Verify potential replacements exist
    const potentialReplacements = await this.userRepository.findByIds(
      dto.lista_selectata,
    );
    if (potentialReplacements.length !== dto.lista_selectata.length) {
      throw new NotFoundException(
        'One or more potential replacement users not found.',
      );
    }

    const swapRequest = this.onCallSwapRepository.create({
      onCall: onCallSlot,
      onCallId: onCallSlot.id,
      requester,
      requesterId: requester.id,
      potentialReplacements, // Assign User entities
      status: OnCallSwapStatus.PENDING,
      requestDate: new Date(),
    });

    return this.onCallSwapRepository.save(swapRequest);
  }

  // Add methods to approve/reject swaps, find swaps, etc.
}
