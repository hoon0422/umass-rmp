import { Rate } from '@models/entity/Rate.entity';
import { User, UserLevel } from '@models/entity/User.entity';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository, MockRepository } from '@rmp/utils/mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository<User>;
  let rateRepository: MockRepository<Rate>;

  const user = new User();
  user.id = 1;
  user.username = 'username';
  user.password = 'password';
  user.nickname = 'nickname';
  user.level = UserLevel.FullAccess;

  const rates: Rate[] = [];
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const rate = new Rate();
    rate.id = i;
    rate.user = user;
    rate.createdDate = new Date(now.getFullYear(), i - 1, 1, 0, 0, 0, 0);
    rates.push(rate);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(Rate),
          useValue: createMockRepository<Rate>(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    rateRepository = module.get<MockRepository<Rate>>(getRepositoryToken(Rate));

    userRepository.findOne.mockImplementation(async (userId: number) => {
      if (userId === user.id) {
        return user;
      }
      return undefined;
    });
    rateRepository.count = jest.fn();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('isUserAuthorizedToReadRates', () => {
    it('should return true for user with "FullAccess" level', async (done) => {
      user.level = UserLevel.FullAccess;
      expect(
        await userService.isUserAuthorizedToReadRates(user.id),
      ).toBeTruthy();
      done();
    });

    it('should return false for user with level lower than "FullAccess"', async (done) => {
      user.level = UserLevel.Rateable;
      expect(
        await userService.isUserAuthorizedToReadRates(user.id),
      ).toBeFalsy();
      user.level = UserLevel.NotVerified;
      expect(
        await userService.isUserAuthorizedToReadRates(user.id),
      ).toBeFalsy();
      done();
    });

    it('should return false with undefined user ID', async (done) => {
      expect(await userService.isUserAuthorizedToReadRates()).toBeFalsy();
      done();
    });

    it('should return false with invalid user ID', async (done) => {
      expect(await userService.isUserAuthorizedToReadRates(10000)).toBeFalsy();
      done();
    });
  });

  describe('isUserAuthorizedToWriteRate', () => {
    it('should return true for user with "Rateable" level or higher', async (done) => {
      user.level = UserLevel.Rateable;
      expect(
        await userService.isUserAuthorizedToWriteRate(user.id),
      ).toBeTruthy();
      user.level = UserLevel.FullAccess;
      expect(
        await userService.isUserAuthorizedToWriteRate(user.id),
      ).toBeTruthy();
      done();
    });

    it('should return false for user with level lower than "Rateable"', async (done) => {
      user.level = UserLevel.NotVerified;
      expect(
        await userService.isUserAuthorizedToWriteRate(user.id),
      ).toBeFalsy();
      done();
    });

    it('should return false with undefined user ID', async (done) => {
      expect(await userService.isUserAuthorizedToWriteRate()).toBeFalsy();
      done();
    });

    it('should return false with invalid user ID', async (done) => {
      expect(await userService.isUserAuthorizedToWriteRate(10000)).toBeFalsy();
      done();
    });
  });

  describe('isUserVerified', () => {
    it('should return true for user with higher level than "NotVerified"', async (done) => {
      user.level = UserLevel.Rateable;
      expect(await userService.isUserVerified(user.id)).toBeTruthy();
      user.level = UserLevel.FullAccess;
      expect(await userService.isUserVerified(user.id)).toBeTruthy();
      done();
    });

    it('should return false for user with "NotVerified" level', async (done) => {
      user.level = UserLevel.NotVerified;
      expect(await userService.isUserVerified(user.id)).toBeFalsy();
      done();
    });

    it('should return false with undefined user ID', async (done) => {
      expect(await userService.isUserVerified()).toBeFalsy();
      done();
    });

    it('should return false with invalid user ID', async (done) => {
      expect(await userService.isUserVerified(10000)).toBeFalsy();
      done();
    });
  });

  describe('getDurationForUserLevelUpdate', () => {
    it('should return valid duration when today is Fall semester', () => {
      const today = new Date(2021, 9 - 1, 10);
      const { from, to } = userService.getDurationForUserLevelUpdate(today);
      expect(from.getTime()).toEqual(
        new Date(today.getFullYear(), 9 - 1, 1, 0, 0, 0, 0).getTime(),
      );
      expect(to.getTime()).toEqual(
        new Date(today.getFullYear() + 1, 1 - 1, 31, 23, 59, 59, 999).getTime(),
      );
    });

    it('should return valid duration when today is Spring semester', () => {
      const today = new Date(2021, 4 - 1, 10);
      const { from, to } = userService.getDurationForUserLevelUpdate(today);
      expect(from.getTime()).toEqual(
        new Date(today.getFullYear(), 2 - 1, 1, 0, 0, 0, 0).getTime(),
      );
      expect(to.getTime()).toEqual(
        new Date(today.getFullYear(), 8 - 1, 31, 23, 59, 59, 999).getTime(),
      );
    });
  });

  describe('updateUserLevelOfVerifiedUser', () => {
    it('should return user with updated level from "Rateable" to "FullAccess" for valid case', async (done) => {
      user.level = UserLevel.Rateable;
      rateRepository.count.mockResolvedValueOnce(
        UserService.userLevelCriteria.FullAccess,
      );
      userRepository.save.mockResolvedValueOnce(user);

      try {
        const updatedUser = await userService.updateUserLevelOfVerifiedUser(
          user.id,
        );
        expect(updatedUser.level).toEqual(UserLevel.FullAccess);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should return user with updated level from "FullAccess" to "Rateable" for valid case', async (done) => {
      user.level = UserLevel.FullAccess;
      rateRepository.count.mockResolvedValueOnce(
        UserService.userLevelCriteria.FullAccess - 1,
      );
      userRepository.save.mockResolvedValueOnce(user);

      try {
        const updatedUser = await userService.updateUserLevelOfVerifiedUser(
          user.id,
        );
        expect(updatedUser.level).toEqual(UserLevel.Rateable);
        done();
      } catch (e) {
        fail(e);
      }
    });

    it('should throw an error with not verified user', async (done) => {
      user.level = UserLevel.NotVerified;
      try {
        await userService.updateUserLevelOfVerifiedUser(user.id);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          UserService.messages.NotVerifiedUser,
        );
        expect(user.level).toEqual(UserLevel.NotVerified);
        done();
      }
    });

    it('should throw an error with invalid user ID', async (done) => {
      try {
        await userService.updateUserLevelOfVerifiedUser(10000);
        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.getResponse().message[0]).toEqual(
          UserService.messages.NotVerifiedUser,
        );
        done();
      }
    });
  });
});
