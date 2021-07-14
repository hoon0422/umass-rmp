import { Section } from '@models/entity/Section.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@rmp/user/user.module';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { User } from '@models/entity/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, User]), UserModule],
  providers: [SectionService],
  exports: [SectionService],
  controllers: [SectionController],
})
export class SectionModule {}
