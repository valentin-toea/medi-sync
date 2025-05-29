/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Auth } from './auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../user/users.service'; // For fetching complete user details

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(User) // If needed for more detailed user fetching
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService, // For getting detailed user info
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const authEntry = await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (authEntry && (await bcrypt.compare(pass, authEntry.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...user } = authEntry; // Exclude password hash from authEntry object
      return user.user; // Return the user object without passwordHash
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // Fetch detailed user for the response
    const userDetails = await this.usersService.findOne(user.id);

    return {
      token: accessToken,
      utilizator: {
        id: userDetails.id,
        nume: userDetails.lastName, // Assuming lastName is 'nume'
        prenume: userDetails.firstName, // Assuming firstName is 'prenume'
        rol: userDetails.role,
        email: userDetails.email,
      },
    };
  }

  // Helper to hash password during user creation/update (should be in UsersService or Auth if it handles registration)
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await bcrypt.hash(password, saltRounds);
  }
}
