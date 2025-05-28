import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification } from './notification.entity';
// import { CreateNotificationDto } from './dto/create-notification.dto'; // If needed for manual creation

@Controller('api/notificari')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':utilizator_id')
  async getNotificationsByUserId(
    @Param('utilizator_id', ParseIntPipe) userId: number,
    @Req() req: Request & { user: { userId: number; role: string } },
  ): Promise<Partial<Notification>[]> {
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      // Example authorization
      throw new ForbiddenException(
        "Cannot access another user's notifications.",
      );
    }
    const notifications = await this.notificationService.findByUserId(userId);
    return notifications.map((n) => ({
      id: n.id,
      titlu: n.title,
      mesaj: n.message,
      data_trimitere: n.sentDate.toISOString(),
      citit: n.isRead,
    }));
  }

  async markNotificationAsRead(
    @Param('id', ParseIntPipe) notificationId: number,
    @Req() req: Request & { user: { userId: number; role: string } },
  ): Promise<Partial<Notification>> {
    const userId = req.user.userId;
    const updatedNotification = await this.notificationService.markAsRead(
      notificationId,
      userId,
    );
    return {
      id: updatedNotification.id,
      title: updatedNotification.title,
      message: updatedNotification.message,
      sentDate: updatedNotification.sentDate,
      isRead: updatedNotification.isRead,
    };
  }
}

// Example: Manually creating a notification (might be done by other services internally)
// @Post()
// @UseGuards(RolesGuard)
// @Roles(UserRole.ADMIN) // Only admins can create notifications directly for example
// createNotification(@Body() createNotificationDto: CreateNotificationDto) {
//   return this.notificationService.create(createNotificationDto);
// }
