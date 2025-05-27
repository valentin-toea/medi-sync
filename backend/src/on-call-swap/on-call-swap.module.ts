import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnCallSwapService } from './on-call-swap.service';
import { OnCallSwapController } from './on-call-swap.controller';
import { OnCallSwap } from './on-call-swap.entity';
import { User } from '../user/user.entity';
import { OnCall } from '../on-call/on-call.entity';
import { AuthModule } from '../auth/auth.module';
import { OnCallModule } from '../on-call/on-call.module'; // To access OnCallRepository if not re-imported

@Module({
  imports: [
    TypeOrmModule.forFeature([OnCallSwap, User, OnCall]),
    AuthModule,
    OnCallModule, // Provides OnCallRepository if needed
  ],
  controllers: [OnCallSwapController],
  providers: [OnCallSwapService],
})
export class OnCallSwapModule {}
