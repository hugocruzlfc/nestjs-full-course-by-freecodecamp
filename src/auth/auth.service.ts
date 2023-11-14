import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  signin() {}

  signup(authBody: AuthDto) {}
}
