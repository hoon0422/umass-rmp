import { ClassCategory } from '@models/entity/ClassCategory.entity';
import { Course } from '@models/entity/Course.entity';
import { Major } from '@models/entity/Major.entity';
import { Professor } from '@models/entity/Professor.entity';
import { Rate } from '@models/entity/Rate.entity';
import { Section } from '@models/entity/Section.entity';
import { SectionTime, Weekday } from '@models/entity/SectionTime.entity';
import { Season, Semester } from '@models/entity/Semester.entity';
import { SpireLocation } from '@models/entity/SpireLocation.entity';
import { User, UserLevel } from '@models/entity/User.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '@rmp/user/user.service';
import { createMockRepository, MockRepository } from '@rmp/utils/mock';
import { SectionService } from './section.service';

describe('SectionService', () => {
  let sectionService: SectionService;
  let userRepository: MockRepository<User>;
  let sectionRepository: MockRepository<Section>;

  const major = new Major();
  major.id = 1;
  major.name = 'dummy major';

  const user = new User();
  user.id = 1;
  user.username = 'username';
  user.password = 'password';
  user.nickname = 'nickname';
  user.major = major;
  user.level = UserLevel.FullAccess;

  const course = new Course();
  course.id = 1;
  course.title = 'dummy course';
  course.courseNumber = 'ADC 123';
  course.major = major;
  course.semester = new Semester();
  course.semester.id = 1;
  course.semester.year = 2020;
  course.semester.season = Season.Fall;

  const category = new ClassCategory();
  category.id = 1;
  category.name = 'dummy category';

  const professor1 = new Professor();
  professor1.id = 1;
  professor1.email = 'prof1@umass.edu';
  professor1.name = 'pf1first pf1last';

  const professor2 = new Professor();
  professor2.id = 2;
  professor2.email = 'prof2@umass.edu';
  professor2.name = 'pf2first pf2last';

  const sectionTime1 = new SectionTime();
  sectionTime1.weekday = Weekday.Monday;
  sectionTime1.startHour = 15;
  sectionTime1.startMinute = 30;
  sectionTime1.endHour = 16;
  sectionTime1.endMinute = 45;

  const sectionTime2 = new SectionTime();
  sectionTime2.weekday = Weekday.Wednesday;
  sectionTime2.startHour = 15;
  sectionTime2.startMinute = 30;
  sectionTime2.endHour = 16;
  sectionTime2.endMinute = 45;

  const location = new SpireLocation();
  location.id = 1;
  location.location = 'dummy location';

  const section = new Section();
  section.id = 1;
  section.category = category;
  section.components = [category];
  section.classNumber = '00000';
  section.course = course;
  section.minUnits = 1;
  section.maxUnits = 1;
  section.professors = [professor1, professor2];
  section.sectionTimes = [sectionTime1, sectionTime2];
  section.location = location;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(Section),
          useValue: createMockRepository<Section>(),
        },
        {
          provide: getRepositoryToken(Rate),
          useValue: createMockRepository<Rate>(),
        },
      ],
    }).compile();

    sectionService = module.get<SectionService>(SectionService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    sectionRepository = module.get<MockRepository<Section>>(
      getRepositoryToken(Section),
    );

    userRepository.findOne.mockImplementation(async (userId: number) => {
      if (userId === user.id) {
        return user;
      }
      return undefined;
    });
    sectionRepository.findOne.mockImplementation(async (sectionId: number) => {
      if (sectionId === section.id) {
        return section;
      }
      return undefined;
    });
  });
  it('should be defined', () => {
    expect(sectionService).toBeDefined();
  });

  describe('getSection', () => {
    it('should return section with the specified section ID', async (done) => {
      user.level = UserLevel.FullAccess;

      try {
        const foundSection = await sectionService.getSection(section.id);
        expect(foundSection).toBe(section);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error when user ID is invalid', async (done) => {
      try {
        await sectionService.getSection(section.id);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getResponse().message[0]).toEqual(
          SectionService.messages.userIdNotFound,
        );
        done();
      }
    });

    it('should throw an error for low-level user', async (done) => {
      user.level = UserLevel.NotVerified;

      try {
        await sectionService.getSection(section.id);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          SectionService.messages.notVerifiedUser,
        );
        done();
      }
    });
  });
});
