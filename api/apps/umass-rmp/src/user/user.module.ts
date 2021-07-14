import { Rate } from '@models/entity/Rate.entity';
import { User } from '@models/entity/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLevelGuard } from './user-level.guard';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rate])],
  providers: [UserService, UserLevelGuard],
  exports: [UserService, UserLevelGuard],
})
export class UserModule {}
