import { User, UserLevel } from '@models/entity/User.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Injectable()
export class UserLevelGuard implements CanActivate {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const level = this.reflector.get<UserLevel>('level', context.getHandler());
    if (!level) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      return false;
    }
    const user = await this.userRepository.findOne(req.user.id);

    return user.level >= level;
  }
}

export const AllowedUserLevel = (level: UserLevel) =>
  SetMetadata('level', level);
