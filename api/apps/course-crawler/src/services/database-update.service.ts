import { CrawlService } from './crawl.service';
import {
  CourseData,
  MajorData,
  ProfessorData,
  SectionData,
  SectionTimeData,
  SemesterData,
  Option,
} from '../models';
import { SectionTime, Weekday } from '@models/entity/SectionTime.entity';
import { Season, Semester } from '@models/entity/Semester.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';
import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ClassCategory } from '@models/entity/ClassCategory.entity';
import { Professor } from '@models/entity/Professor.entity';
import { Course } from '@models/entity/Course.entity';
import { Major } from '@models/entity/Major.entity';
import { Section } from '@models/entity/Section.entity';
import { SpireLocation } from '@models/entity/SpireLocation.entity';

@Service()
export class DatabaseUpdateService {
  @Inject() private readonly crawlService: CrawlService;

  @InjectRepository(ClassCategory)
  private readonly categoryRepository: Repository<ClassCategory>;

  @InjectRepository(Professor)
  private readonly professorRepository: Repository<Professor>;

  @InjectRepository(Course)
  private readonly courseRepository: Repository<Course>;

  @InjectRepository(Major)
  private readonly majorRepository: Repository<Major>;

  @InjectRepository(Section)
  private readonly sectionRepository: Repository<Section>;

  @InjectRepository(SectionTime)
  private readonly sectionTimeRepository: Repository<SectionTime>;

  @InjectRepository(Semester)
  private readonly semesterRepository: Repository<Semester>;

  @InjectRepository(SpireLocation)
  private readonly spireLocationRepository: Repository<SpireLocation>;

  async updateDatabase(
    dirBasename?: string,
    majors?: string[],
    semesters?: string[],
  ) {
    await this.crawlService.moveToSearchPage();
    const dirName = await this.getOrCreateDirName(dirBasename);
    const majorOptions = await this.getMajorOptions(dirName, majors);
    const semesterOptions = await this.getSemesterOptions(dirName, semesters);

    for (const semesterOption of semesterOptions) {
      for (const majorOption of majorOptions) {
        const majorData = await this.crawlService.crawlMajor(
          majorOption,
          semesterOption,
        );

        await this.getOrSaveSemester(majorData.semester);
        await this.getOrSaveMajor(majorData);
        for (const courseData of majorData.courses) {
          await this.getOrSaveCourse(courseData, majorData);
          for (const sectionData of courseData.sections) {
            await this.getOrSaveSection(sectionData, courseData, majorData);
          }
        }
      }
    }
  }

  private async getOrCreateDirName(dirBasename?: string) {
    dirBasename = dirBasename || `${new Date().getTime()}`;
    const dirName = join('data', dirBasename);
    await fs.promises
      .access(dirName, fs.constants.F_OK)
      .catch(async () => await fs.promises.mkdir(dirName, { recursive: true }));
    return dirName;
  }

  private async getMajorOptions(
    dirName: string,
    majorsWithName?: string[],
  ): Promise<Option[]> {
    const majorSet = new Set(majorsWithName || []);

    return await fs.promises
      .readFile(join(dirName, 'majors.json'))
      .then((data) => JSON.parse(data.toString()) as Option[])
      .catch(async () => {
        const options = this.crawlService.crawlMajorOptions();
        await fs.promises.writeFile(
          join(dirName, 'majors.json'),
          JSON.stringify(options),
        );
        return options;
      })
      .then((options) =>
        options.filter(
          (o: Option) => majorSet.size === 0 || majorSet.has(o.name),
        ),
      );
  }

  private async getSemesterOptions(
    dirName: string,
    semestersWithName?: string[],
  ): Promise<Option[]> {
    const semesterSet = new Set(semestersWithName);
    return await fs.promises
      .readFile(join(dirName, 'semesters.json'))
      .then((data) => JSON.parse(data.toString()))
      .catch(async () => {
        const options = this.crawlService.crawlSemesterOptions();
        await fs.promises.writeFile(
          join(dirName, 'semesters.json'),
          JSON.stringify(options),
        );
        return options;
      })
      .then((options) =>
        options.filter(
          (o: Option) =>
            semestersWithName.length === 0 || semesterSet.has(o.name),
        ),
      );
  }
  private async getOrSaveSemester(semesterData: SemesterData) {
    let semester = await this.getSemester(semesterData);

    if (semester) {
      return semester;
    } else {
      semester = new Semester();
      semester.season = Season[semesterData.season];
      semester.year = semesterData.year;
      return await this.semesterRepository.save(semester);
    }
  }

  private async getOrSaveMajor(majorData: MajorData) {
    let major = await this.getMajor(majorData);

    if (major) {
      return major;
    } else {
      major = new Major();
      major.name = majorData.name;
      return await this.majorRepository.save(major);
    }
  }

  private async getOrSaveCourse(courseData: CourseData, majorData: MajorData) {
    let course = await this.getCourse(courseData, majorData.semester);

    if (course) {
      return course;
    } else {
      course = new Course();
      course.title = courseData.title;
      course.courseNumber = courseData.courseNumber;
      course.semester = await this.getOrSaveSemester(majorData.semester);
      course.major = await this.getOrSaveMajor(majorData);
      return await this.courseRepository.save(course);
    }
  }

  private async getOrSaveProfessor(professorData: ProfessorData) {
    let professor = await this.getProfessor(professorData);

    if (professor) {
      return professor;
    } else {
      professor = new Professor();
      professor.name = professorData.name;
      professor.email = professorData.email;
      return await this.professorRepository.save(professor);
    }
  }

  private async getOrSaveCategory(categoryName: string) {
    let category = await this.getCategory(categoryName);

    if (category) {
      return category;
    } else {
      category = new ClassCategory();
      category.name = categoryName;
      return await this.categoryRepository.save(category);
    }
  }

  private async getOrSaveSpireLocation(location: string) {
    let spireLocation = await this.getSpireLocation(location);

    if (spireLocation) {
      return spireLocation;
    } else {
      spireLocation = new SpireLocation();
      spireLocation.location = location;
      return await this.spireLocationRepository.save(spireLocation);
    }
  }

  private async getOrSaveSectionTime(sectionTimeData: SectionTimeData) {
    let sectionTime = await this.getSectionTime(sectionTimeData);

    if (sectionTime) {
      return sectionTime;
    } else {
      sectionTime = new SectionTime();
      sectionTime.weekday = weekdayStrToWeekday(sectionTimeData.weekday);
      sectionTime.startHour = sectionTimeData.startHour;
      sectionTime.startMinute = sectionTimeData.startMinute;
      sectionTime.endHour = sectionTimeData.endHour;
      sectionTime.endMinute = sectionTimeData.endMinute;
      return await this.sectionTimeRepository.save(sectionTime);
    }
  }

  private async getOrSaveSection(
    sectionData: SectionData,
    courseData: CourseData,
    majorData: MajorData,
  ) {
    let section = await this.getSection(sectionData, majorData.semester);

    if (section) {
      return section;
    } else {
      section = new Section();
      section.classNumber = sectionData.classNumber;
      section.maxUnits = sectionData.maxUnit;
      section.minUnits = sectionData.minUnit;
      section.online = sectionData.online;

      section.category = await this.getOrSaveCategory(sectionData.category);

      section.components = await Promise.all(
        sectionData.components.map(
          async (component) => await this.getOrSaveCategory(component),
        ),
      );

      section.professors = await Promise.all(
        sectionData.professors.map(
          async (professorData) => await this.getOrSaveProfessor(professorData),
        ),
      );

      if (sectionData.room && !sectionData.online) {
        section.location = await this.getOrSaveSpireLocation(sectionData.room);
      }

      section.sectionTimes = await Promise.all(
        sectionData.time.map(
          async (sectionTimeData) =>
            await this.getOrSaveSectionTime(sectionTimeData),
        ),
      );

      section.course = await this.getOrSaveCourse(courseData, majorData);

      return await this.sectionRepository.save(section);
    }
  }

  private async getSemester(semesterData: SemesterData) {
    return await this.semesterRepository.findOne({
      year: semesterData.year,
      season: Season[semesterData.season],
    });
  }

  private async getMajor(majorData: MajorData) {
    return await this.majorRepository.findOne({
      name: majorData.name,
    });
  }

  private async getCourse(courseData: CourseData, semesterData: SemesterData) {
    return this.courseRepository.findOne({
      semester: await this.getSemester(semesterData),
      courseNumber: courseData.courseNumber,
    });
  }

  private async getSection(
    sectionData: SectionData,
    semesterData: SemesterData,
  ) {
    return await this.sectionRepository.findOne({
      classNumber: sectionData.classNumber,
      course: { semester: await this.getSemester(semesterData) },
    });
  }

  private async getProfessor(professorData: ProfessorData) {
    return await this.professorRepository.findOne({
      email: professorData.email,
    });
  }

  private async getCategory(categoryName: string) {
    return await this.categoryRepository.findOne({
      name: categoryName,
    });
  }

  private async getSpireLocation(location: string) {
    return await this.spireLocationRepository.findOne({
      location,
    });
  }

  private async getSectionTime(sectionTimeData: SectionTimeData) {
    return await this.sectionTimeRepository.findOne({
      ...sectionTimeData,
      weekday: weekdayStrToWeekday(sectionTimeData.weekday),
    });
  }
}

function weekdayStrToWeekday(weekdayStr: string) {
  switch (weekdayStr) {
    case 'Mo':
      return Weekday.Monday;
    case 'Tu':
      return Weekday.Tuesday;
    case 'We':
      return Weekday.Wednesday;
    case 'Th':
      return Weekday.Thursday;
    case 'Fr':
      return Weekday.Friday;
    case 'Sa':
      return Weekday.Saturday;
    case 'Su':
      return Weekday.Sunday;
    default:
      throw new Error('Not defined weekday');
  }
}
