import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signin(authBody: AuthDto) {
    try {
      const userFounded = await this.prismaService.user.findUnique({
        where: {
          email: authBody.email,
        },
      });

      if (!userFounded) {
        throw new ForbiddenException('Email not found');
      }

      const isPasswordMatches = await argon.verify(
        userFounded.hash,
        authBody.password,
      );

      if (!isPasswordMatches) {
        throw new ForbiddenException('Password is incorrect');
      }

      return this.signToken(userFounded.id, userFounded.email);
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async signup(authBody: AuthDto) {
    try {
      const hash = await argon.hash(authBody.password);
      const user = await this.prismaService.user.create({
        data: {
          email: authBody.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // delete user.hash;

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email already exists');
      }
      throw new Error('Internal Server Error');
    }
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
