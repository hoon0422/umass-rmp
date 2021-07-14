import { ClassCategory } from '@models/entity/ClassCategory.entity';
import { Course } from '@models/entity/Course.entity';
import { Major } from '@models/entity/Major.entity';
import { Rate } from '@models/entity/Rate.entity';
import { Section } from '@models/entity/Section.entity';
import { Season, Semester } from '@models/entity/Semester.entity';
import { User, UserLevel } from '@models/entity/User.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RateEditDto, RateWriteDto } from '@rmp/dto/Rate';
import { UserService } from '@rmp/user/user.service';
import { createMockRepository, MockRepository } from '@rmp/utils/mock';
import { RateService } from './rate.service';

describe('RateService', () => {
  let rateService: RateService;
  let sectionRepository: MockRepository<Section>;
  let userRepository: MockRepository<User>;
  let rateRepository: MockRepository<Rate>;

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

  const section1 = new Section();
  section1.id = 1;
  section1.category = category;
  section1.classNumber = '00000';
  section1.course = course;
  section1.minUnits = 1;
  section1.maxUnits = 1;

  const section2 = new Section();
  section2.id = 2;
  section2.category = category;
  section2.classNumber = '00001';
  section2.course = course;
  section2.minUnits = 2;
  section2.maxUnits = 2;

  const rate1_1 = new Rate();
  rate1_1.id = 1;
  rate1_1.overallScore = 1;
  rate1_1.easyness = 1;
  rate1_1.learned = 1;
  rate1_1.teaching = 1;
  rate1_1.rate = '1st rate';
  rate1_1.user = user;
  rate1_1.section = section1;
  rate1_1.createdDate = new Date();
  rate1_1.modifiedDate = rate1_1.createdDate;

  const rate1_2 = new Rate();
  rate1_2.id = 2;
  rate1_2.overallScore = 2;
  rate1_2.easyness = 2;
  rate1_2.learned = 2;
  rate1_2.teaching = 2;
  rate1_2.rate = '2nd rate';
  rate1_2.user = user;
  rate1_2.section = section1;
  rate1_2.createdDate = new Date();
  rate1_2.modifiedDate = rate1_2.createdDate;

  const rate1_3 = new Rate();
  rate1_3.id = 3;
  rate1_3.overallScore = 3;
  rate1_3.easyness = 3;
  rate1_3.learned = 3;
  rate1_3.teaching = 3;
  rate1_3.rate = '3rd rate';
  rate1_3.user = user;
  rate1_3.section = section1;
  rate1_3.createdDate = new Date();
  rate1_3.modifiedDate = rate1_3.createdDate;

  const rate2_1 = new Rate();
  rate2_1.id = 4;
  rate2_1.overallScore = 4;
  rate2_1.easyness = 4;
  rate2_1.learned = 4;
  rate2_1.teaching = 4;
  rate2_1.rate = '4th rate';
  rate2_1.user = user;
  rate2_1.section = section2;
  rate2_1.createdDate = new Date();
  rate2_1.modifiedDate = rate2_1.createdDate;

  const rate2_2 = new Rate();
  rate2_2.id = 5;
  rate2_2.overallScore = 5;
  rate2_2.easyness = 5;
  rate2_2.learned = 5;
  rate2_2.teaching = 5;
  rate2_2.rate = '5th rate';
  rate2_2.user = user;
  rate2_2.section = section2;
  rate2_2.createdDate = new Date();
  rate2_2.modifiedDate = rate2_2.createdDate;

  const rates = [rate1_1, rate1_2, rate1_3, rate2_1, rate2_2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
            process.env.NODE_ENV === 'production'
              ? '.env'
              : `.${process.env.NODE_ENV}.env`,
        }),
      ],
      providers: [
        UserService,
        RateService,
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

    rateService = module.get<RateService>(RateService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    rateRepository = module.get<MockRepository<Rate>>(getRepositoryToken(Rate));
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
      if (sectionId === section1.id) {
        return section1;
      }
      if (sectionId === section2.id) {
        return section2;
      }
      return undefined;
    });
    rateRepository.find.mockImplementation(async (findOptions) => {
      return rates
        .filter((r) => r.section.id === findOptions.where.section.id)
        .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
    });
    rateRepository.findOne.mockImplementation(async (rateId) => {
      return rates.find((r) => r.id === rateId);
    });
  });

  it('should be defined', () => {
    expect(rateService).toBeDefined();
  });

  describe('getRates', () => {
    it('should return rates of the given section ID in descending order for valid user', async (done) => {
      user.level = UserLevel.FullAccess;
      try {
        const ratesForSection1 = await rateService.getRates(
          section1.id,
          user.id,
        );

        const rateIds = ratesForSection1.map((r) => r.id);
        expect(rateIds).toContain(rate1_1.id);
        expect(rateIds).toContain(rate1_2.id);
        expect(rateIds).toContain(rate1_3.id);
        expect(rateIds).not.toContain(rate2_1.id);
        expect(rateIds).not.toContain(rate2_2.id);

        for (let i = 0; i < ratesForSection1.length - 1; i++) {
          expect(
            ratesForSection1[i].createdDate.getTime(),
          ).toBeGreaterThanOrEqual(
            ratesForSection1[i + 1].createdDate.getTime(),
          );
        }

        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error for invalid user ID', async (done) => {
      try {
        await rateService.getRates(section1.id, 10000);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.userIdNotFound,
        );
        done();
      }
    });

    it('should throw an error for low-level user', async (done) => {
      user.level = UserLevel.Rateable;
      try {
        await rateService.getRates(section1.id, user.id);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.userWithoutFullAccess,
        );
        done();
      }
    });
  });

  describe('writeRate', () => {
    let rateWriteDto: RateWriteDto;

    beforeEach(() => {
      rateWriteDto = new RateWriteDto();
      rateWriteDto.easyness = 5;
      rateWriteDto.learned = 5;
      rateWriteDto.overallScore = 5;
      rateWriteDto.teaching = 5;
      rateWriteDto.rate = 'new rate';
    });

    it('should return a newly created rate with updating user level', async (done) => {
      user.level = UserLevel.Rateable;

      rateRepository.count = jest.fn();
      rateRepository.count.mockResolvedValueOnce(
        UserService.userLevelCriteria.FullAccess,
      );
      rateRepository.save.mockImplementationOnce(async (rate: Rate) => {
        rate.id = Math.max(...rates.map((r) => r.id)) + 1;
        // rates.push(rate);
        return rate;
      });
      userRepository.save.mockResolvedValueOnce(user);

      try {
        const newRate = await rateService.writeRate(
          section1.id,
          user.id,
          rateWriteDto,
        );

        expect(newRate.user).toBe(user);
        expect(newRate.section).toBe(section1);
        expect(newRate.overallScore).toEqual(rateWriteDto.overallScore);
        expect(newRate.learned).toEqual(rateWriteDto.learned);
        expect(newRate.easyness).toEqual(rateWriteDto.easyness);
        expect(newRate.teaching).toEqual(rateWriteDto.teaching);
        expect(newRate.rate).toEqual(rateWriteDto.rate);
        expect(user.level).toEqual(UserLevel.FullAccess);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error for an invalid user ID', async (done) => {
      try {
        await rateService.writeRate(section1.id, 10000, rateWriteDto);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.userIdNotFound,
        );
        done();
      }
    });

    it('should throw an error for low-level user', async (done) => {
      user.level = UserLevel.NotVerified;
      try {
        await rateService.writeRate(section1.id, user.id, rateWriteDto);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.userWithoutRateable,
        );
        done();
      }
    });
  });

  describe('editRate', () => {
    let rateEditDto: RateEditDto;

    beforeEach(() => {
      rateEditDto = new RateEditDto();
      rateEditDto.overallScore = 2;
      rateEditDto.learned = 2;
      rateEditDto.easyness = 2;
      rateEditDto.teaching = 2;
      rateEditDto.rate = 'new 1st rate';
    });

    it('should return an updated rate', async (done) => {
      rateRepository.save.mockResolvedValueOnce(rate1_1);

      try {
        const updatedRate = await rateService.editRate(
          rate1_1.id,
          user.id,
          rateEditDto,
        );

        expect(updatedRate.overallScore).toEqual(rateEditDto.overallScore);
        expect(updatedRate.learned).toEqual(rateEditDto.learned);
        expect(updatedRate.easyness).toEqual(rateEditDto.easyness);
        expect(updatedRate.teaching).toEqual(rateEditDto.teaching);
        expect(updatedRate.rate).toEqual(rateEditDto.rate);
        expect(updatedRate.user).toBe(user);
        expect(updatedRate.section).toBe(section1);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error for an invalid rate ID', async (done) => {
      try {
        await rateService.editRate(10000, user.id, rateEditDto);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.rateIdNotFound,
        );
        done();
      }
    });

    it('should throw an error for user who is not owner of the rate', async (done) => {
      try {
        await rateService.editRate(rate1_1.id, 10000, rateEditDto);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.rateNotWrittenByUser,
        );
        done();
      }
    });
  });

  describe('deleteRate', () => {
    it('should return a deleted rate', async (done) => {
      rateRepository.remove = jest.fn();
      rateRepository.remove.mockResolvedValueOnce(rate1_1);
      try {
        const deletedRate = await rateService.deleteRate(rate1_1.id, user.id);
        expect(deletedRate).toBe(rate1_1);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error for an invalid rate ID', async (done) => {
      try {
        await rateService.deleteRate(10000, user.id);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.rateIdNotFound,
        );
        done();
      }
    });

    it('should throw an error for user who is not owner of the rate', async (done) => {
      try {
        await rateService.deleteRate(rate1_1.id, 10000);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          RateService.messages.rateNotWrittenByUser,
        );
        done();
      }
    });
  });
});
