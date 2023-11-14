import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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

      delete userFounded.hash;
      return userFounded;
    } catch (error) {}
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

      return user;
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
}
