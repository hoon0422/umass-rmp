import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '@models/entity/Section.entity';
import { Course } from '@models/entity/Course.entity';
import { Semester } from '@models/entity/Semester.entity';
import { ClassCategory } from '@models/entity/ClassCategory.entity';
import { Major } from '@models/entity/Major.entity';
import { Professor } from '@models/entity/Professor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Section,
      Course,
      Major,
      Semester,
      ClassCategory,
      Professor,
    ]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
