import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@models/entity/User.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  @Inject() private authService: AuthService;

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.authenticate(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
