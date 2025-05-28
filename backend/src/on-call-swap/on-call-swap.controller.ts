import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OnCallSwapService } from './on-call-swap.service';
import { CreateOnCallSwapDto } from './dto/create-oncallswap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForbiddenException } from '@nestjs/common';

@Controller('api/garda') // Nested under 'garda' as per spec
@UseGuards(JwtAuthGuard)
export class OnCallSwapController {
  constructor(private readonly onCallSwapService: OnCallSwapService) {}

  @Post(':data/:specialitate/substituire')
  @HttpCode(HttpStatus.CREATED)
  async createSwapRequest(
    @Param('data') date: string, // YYYY-MM-DD
    @Param('specialitate') specialty: string,
    @Body() createOnCallSwapDto: CreateOnCallSwapDto,
    @Req() req: { user: { userId: string } }, // To ensure the authenticated user is the one making the request
  ): Promise<{ mesaj: string }> {
    if (req.user.userId !== String(createOnCallSwapDto.solicitant_id)) {
      throw new ForbiddenException(
        'You can only create swap requests for yourself.',
      );
    }
    await this.onCallSwapService.createSwapRequest(
      date,
      specialty,
      createOnCallSwapDto,
    );
    return { mesaj: 'Cerere de substituire creată' };
  }
}
