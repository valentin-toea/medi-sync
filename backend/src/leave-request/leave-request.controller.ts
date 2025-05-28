/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req, // To get user from request
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type * as multer from 'multer';
import { extname } from 'path';
import { LeaveRequestService } from './leave-request.service';
import { UpdateLeaveRequestStatusDto } from './dto/update-leaverequest-status.dto';
import { CreateLeaveRequestDto } from './dto/create-leaverequest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity'; // Assuming UserRole enum exists
import { existsSync } from 'fs';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/concedii')
@UseGuards(JwtAuthGuard)
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Get(':utilizator_id')
  async getLeaveRequestsByUserId(
    @Param('utilizator_id', ParseIntPipe) userId: number,
  ): Promise<any[]> {
    const requests = await this.leaveRequestService.findByUserId(userId);
    return requests.map((req) => {
      return {
        id: req.id,
        data_inceput: req.startDate
          ? req.startDate instanceof Date
            ? req.startDate.toISOString().split('T')[0]
            : new Date(req.startDate).toISOString().split('T')[0]
          : null,
        data_sfarsit: req.endDate
          ? req.endDate instanceof Date
            ? req.endDate.toISOString().split('T')[0]
            : new Date(req.endDate).toISOString().split('T')[0]
          : null,
        tip: req.type,
        status: req.status,
      };
    });
  }

  @Get('download/:leaveRequestId')
  async downloadAttachment(
    @Param('leaveRequestId', ParseIntPipe) leaveRequestId: number,
    @Res() res: Response,
  ) {
    const leaveRequest =
      await this.leaveRequestService.findById(leaveRequestId);
    if (!leaveRequest || !leaveRequest.attachment) {
      return res.status(404).json({ mesaj: 'Attachment not found' });
    }

    const filePath = join(process.cwd(), leaveRequest.attachment);
    if (!existsSync(filePath)) {
      return res.status(404).json({ mesaj: 'File not found on server' });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${leaveRequest.attachment.split('/').pop()}"`,
    );
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('atasament', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      storage: diskStorage({
        destination: './uploads/attachments',
        filename: (
          _req: any,
          file: { originalname: string; fieldname: any },
          callback: (arg0: null, arg1: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i)) {
          // Case insensitive
          return callback(
            new Error('Only image and document files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    }),
  )
  async create(
    @UploadedFile() file: multer.File,
    @Req() req, // To get the authenticated user ID
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<{ mesaj: string; id: number }> {
    // Ensure userId in DTO matches authenticated user or is handled by admin
    if (
      req.user.userId !== +createLeaveRequestDto.userId &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You can only create leave requests for yourself unless you are an admin.',
      );
    }

    if (file) {
      createLeaveRequestDto.attachment = file.path;
    }
    const leaveRequest = await this.leaveRequestService.create(
      createLeaveRequestDto,
    );
    return {
      mesaj: 'Cerere de concediu înregistrată',
      id: leaveRequest.id,
    };
  }

  @Put('/admin/:concediu_id') // Route for admin
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('concediu_id', ParseIntPipe) leaveRequestId: number,
    @Body() updateDto: UpdateLeaveRequestStatusDto,
    @Req() req, // To get admin user ID
  ): Promise<{ mesaj: string }> {
    await this.leaveRequestService.updateStatus(
      leaveRequestId,
      updateDto,
      req.user.userId,
    );
    return { mesaj: 'Cerere actualizată' };
  }
}
