import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InternshipService } from './internship.service';
import { ApplyInternshipDto } from './dto/apply-internship.dto';
import { CreateInternshipDto } from './dto/create-internship.dto'; // For admin
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
// import { Internship } from './internship.entity';

@Controller('api/rezidentiat')
@UseGuards(JwtAuthGuard)
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Get(':utilizator_id')
  async getInternshipsForUser(
    @Param('utilizator_id', ParseIntPipe) userId: number,
    @Req() req: { user: { userId: number; role: UserRole } },
  ) {
    // Ensure user can only see their own internships, or admin can see any
    if (req.user.userId !== userId && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "Cannot access another user's internship data.",
      );
    }
    if (
      req.user.role !== UserRole.REZIDENT &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Only residents or admins can access internship data.',
      );
    }
    return this.internshipService.getInternshipsForUser(userId);
  }

  // @Get('stagiu/:stagiu_id')
  // async getInternshipDetails(
  //   @Param('stagiu_id', ParseIntPipe) internshipId: number,
  // ): Promise<Partial<Internship>> {
  //   const internship = await this.internshipService.findOne(internshipId);
  //   return {
  //     // Map to exact response fields from spec
  //     id: internship.id,
  //     denumire: internship.name,
  //     descriere: internship.description,
  //     perioada: `${internship.startDate.toISOString().split('T')[0]} pana la ${internship.endDate.toISOString().split('T')[0]}`,
  //     medic_coordonator: internship.coordinator
  //       ? `Dr. ${internship.coordinator.firstName} ${internship.coordinator.lastName}`
  //       : internship.coordinatorName || 'N/A',
  //     loc_desfasurare: internship.location,
  //     nr_ore: internship.numberOfHours,
  //     minim_proceduri: internship.minimumProcedures,
  //     data_test: internship.testDate
  //       ? internship.testDate.toISOString().split('T')[0]
  //       : 'N/A',
  //   };
  // }

  @Post('aplica/:stagiu_id')
  @HttpCode(HttpStatus.CREATED)
  async applyForInternship(
    @Param('stagiu_id', ParseIntPipe) internshipId: number,
    @Body() applyDto: ApplyInternshipDto, // Contains utilizator_id
    @Req() req: { user: { userId: number; role: UserRole } },
  ): Promise<{ mesaj: string }> {
    if (req.user.userId !== applyDto.utilizator_id) {
      throw new ForbiddenException(
        'You can only apply for internships for yourself.',
      );
    }
    if (req.user.role !== UserRole.REZIDENT) {
      throw new ForbiddenException('Only residents can apply for internships.');
    }
    await this.internshipService.applyForInternship(
      internshipId,
      applyDto.utilizator_id,
    );
    return { mesaj: 'Aplicație pentru stagiu înregistrată' };
  }

  // Example Admin route to create an internship
  @Post('/admin/stagiu')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createInternship(@Body() createInternshipDto: CreateInternshipDto) {
    return this.internshipService.createInternship(createInternshipDto);
  }
}
