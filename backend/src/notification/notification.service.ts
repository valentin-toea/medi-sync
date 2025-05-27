import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.userRepository.findOneBy({
      id: createNotificationDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createNotificationDto.userId} not found.`,
      );
    }
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user,
    });
    return this.notificationRepository.save(notification);
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { sentDate: 'DESC' }, // Show newest first
    });
  }

  async markAsRead(
    notificationId: number,
    userId: number,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
      userId,
    });
    if (!notification) {
      throw new NotFoundException(
        `Notification #${notificationId} for user #${userId} not found.`,
      );
    }
    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }
}
