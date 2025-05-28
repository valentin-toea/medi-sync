// backend/src/user/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Auth } from 'src/auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Make sure UsersService is exported
})
export class UsersModule {}
