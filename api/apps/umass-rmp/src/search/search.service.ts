import { Major } from '@models/entity/Major.entity';
import { Section } from '@models/entity/Section.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchKey } from '@rmp/dto/SearchKey';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  @InjectRepository(Section)
  private readonly sectionRepository: Repository<Section>;
  @InjectRepository(Major)
  private readonly majorRepository: Repository<Major>;

  static readonly messages = {
    invalidSearchField:
      "Field of search must be one of 'classNumber', 'courseNumber', 'title', 'professor'.",
    invalidMajorId: 'The specified major ID is invalid.',
  };

  static readonly searchFields = [
    {
      name: 'Course Title',
      value: 'title',
    },
    {
      name: 'Class Number',
      value: 'classNumber',
    },
    {
      name: 'Course Number',
      value: 'courseNumber',
    },
    {
      name: 'Professor',
      value: 'professor',
    },
  ];

  getSearchFields() {
    return SearchService.searchFields;
  }

  async getMajors() {
    return await this.majorRepository.find();
  }

  async search(searchKey: SearchKey) {
    switch (searchKey.field) {
      case 'classNumber':
        return await this.searchByClassNumber(searchKey);
      case 'courseNumber':
        return await this.searchByCourseNumber(searchKey);
      case 'title':
        return await this.searchByCourseTitle(searchKey);
      case 'professor':
        return await this.searchByProfessor(searchKey);
      default:
        throw new BadRequestException([
          SearchService.messages.invalidSearchField,
        ]);
    }
  }

  private async searchByClassNumber(searchKey: SearchKey) {
    return await this.getQueryBuilderForResultList()
      .where('section."classNumber" = :classNumber', {
        classNumber: searchKey.searchKey,
      })
      .getMany();
  }

  private async searchByCourseNumber(searchKey: SearchKey) {
    let result = this.getQueryBuilderForResultList().where(
      'LOWER(course."courseNumber") like LOWER(:courseNumber)',
      {
        courseNumber: `%${searchKey.searchKey}%`,
      },
    );
    if (searchKey.majorId > 0) {
      if (!(await this.isMajorIdValid(searchKey))) {
        throw new BadRequestException([SearchService.messages.invalidMajorId]);
      }
      result = result.andWhere('major.id = :id', { id: searchKey.majorId });
    }

    return await result.getMany();
  }

  private async searchByCourseTitle(searchKey: SearchKey) {
    let result = this.getQueryBuilderForResultList().where(
      'LOWER(course.title) like LOWER(:title)',
      {
        title: `%${searchKey.searchKey}%`,
      },
    );
    if (searchKey.majorId > 0) {
      if (!(await this.isMajorIdValid(searchKey))) {
        throw new BadRequestException([SearchService.messages.invalidMajorId]);
      }
      result = result.andWhere('major.id = :id', { id: searchKey.majorId });
    }

    return await result.getMany();
  }

  private async searchByProfessor(searchKey: SearchKey) {
    const subquery = this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.professors', 'professors')
      .where('LOWER(professors.name) like LOWER(:professor)', {
        professor: `%${searchKey.searchKey}%`,
      })
      .select('section.id');
    let result = this.getQueryBuilderForResultList().where(
      'section.id in (' + subquery.getQuery() + ')',
    );
    if (searchKey.majorId > 0) {
      if (!(await this.isMajorIdValid(searchKey))) {
        throw new BadRequestException([SearchService.messages.invalidMajorId]);
      }
      result = result.andWhere('major.id = :id', { id: searchKey.majorId });
    }
    return await result.setParameters(subquery.getParameters()).getMany();
  }

  private getQueryBuilderForResultList() {
    return this.sectionRepository
      .createQueryBuilder('section')
      .select(['section.id', ' section.classNumber'])
      .leftJoinAndSelect('section.professors', 'professors')
      .leftJoinAndSelect('section.course', 'course')
      .leftJoinAndSelect('course.major', 'major')
      .leftJoinAndSelect('course.semester', 'semester')
      .leftJoinAndSelect('section.category', 'category')
      .orderBy({
        'course.title': 'ASC',
        'category.name': 'ASC',
        'semester.year': 'DESC',
        'semester.season': 'DESC',
      });
  }

  private async isMajorIdValid(searchKey: SearchKey) {
    return !!(await this.majorRepository.findOne(searchKey.majorId));
  }
}
