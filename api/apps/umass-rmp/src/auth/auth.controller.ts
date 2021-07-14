import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserSignUpDto } from '@rmp/dto/User';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Inject() authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Req() req, @Res({ passthrough: true }) res) {
    const accessToken = await this.authService.login(req.user);
    return {
      accessToken,
    };
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    await this.authService.register(userSignUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(205)
  signOut(@Req() req) {
    req.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Post('current-user')
  @HttpCode(200)
  getCurrentUser(@Req() req) {
    const accessToken = req.headers.authorization as undefined | string;
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    return this.authService.getCurrentUser(accessToken.split(' ')[1]);
  }
}
