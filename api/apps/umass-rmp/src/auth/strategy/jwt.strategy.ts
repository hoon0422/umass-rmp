import { User, UserLevel } from '@models/entity/User.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

export interface JwtPayload {
  username: string;
  nickname: string;
  email: string;
  major: { id: number; name: string };
  level: UserLevel;
  id: typeof User.prototype.id;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @InjectRepository(User) private userRepository: Repository<User>;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
