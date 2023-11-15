import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
//import { AuthGuard } from '@nestjs/passport';
//import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

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

  @Patch()
  editUser() {}
}
