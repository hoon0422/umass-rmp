import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@models/entity/User.entity';
import { Section } from '@models/entity/Section.entity';
import { Rate } from '@models/entity/Rate.entity';
import { UserModule } from '@rmp/user/user.module';
import { SectionModule } from '@rmp/section/section.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Section, Rate]),
    UserModule,
    SectionModule,
  ],
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
