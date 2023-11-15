import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() bodyDto: AuthDto) {
    return this.authService.signup(bodyDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() bodyDto: AuthDto) {
    return this.authService.signin(bodyDto);
  }
}
