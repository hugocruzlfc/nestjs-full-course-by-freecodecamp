import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
//import { AuthGuard } from '@nestjs/passport';
//import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //@UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  //   getMe(@Req() req: Request) {
  //     return req.user;
  //   }
}
