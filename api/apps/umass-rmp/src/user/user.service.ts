import { Rate } from '@models/entity/Rate.entity';
import { User, UserLevel } from '@models/entity/User.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  @InjectRepository(Rate) private readonly rateRepository: Repository<Rate>;

  static readonly messages = {
    NotVerifiedUser: 'Email of the user is not verified.',
  };

  static readonly userLevelCriteria = {
    Rateable: 0, // Everyone with verified account
    FullAccess: 3,
  };

  async isUserAuthorizedToReadRates(userId?: number) {
    if (isNaN(userId)) {
      return false;
    }
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      return false;
    }

    return user.level >= UserLevel.FullAccess;
  }

  async isUserAuthorizedToWriteRate(userId?: number) {
    if (isNaN(userId)) {
      return false;
    }
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      return false;
    }

    return user.level >= UserLevel.Rateable;
  }

  async isUserVerified(userId?: number) {
    if (isNaN(userId)) {
      return false;
    }
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      return false;
    }

    return user.level > UserLevel.NotVerified;
  }

  async updateUserLevelOfVerifiedUser(userId: number) {
    const user = await this.userRepository.findOne(userId);

    if (!user || user.level === UserLevel.NotVerified) {
      throw new ForbiddenException([UserService.messages.NotVerifiedUser]);
    }

    const numOfRatesByUser = await this.getNumOfRatesByUserForUserLevelDuration(
      userId,
    );

    if (numOfRatesByUser >= UserService.userLevelCriteria.FullAccess) {
      user.level = UserLevel.FullAccess;
    } else {
      user.level = UserLevel.Rateable;
    }

    return await this.userRepository.save(user);
  }

  async getNumOfRatesByUserForUserLevelDuration(userId: number) {
    const { from, to } = this.getDurationForUserLevelUpdate();
    return await this.rateRepository.count({
      where: {
        user: { id: userId },
        createdDate: Between(from, to),
      },
    });
  }

  getDurationForUserLevelUpdate(standard = new Date()) {
    const month = standard.getMonth() + 1;
    // Fall semester: 9, 10, 11, 12, 1
    // Spring semester: 2, 3, 4, 5, 6, 7, 8
    if (month === 1 || (9 <= month && month <= 12)) {
      const startYear = standard.getUTCFullYear() - (month === 1 ? 1 : 0);
      return {
        from: new Date(startYear, 9 - 1, 1, 0, 0, 0, 0),
        to: new Date(startYear + 1, 1 - 1, 31, 23, 59, 59, 999),
      };
    } else {
      const startYear = standard.getUTCFullYear();
      return {
        from: new Date(startYear, 2 - 1, 1, 0, 0, 0, 0),
        to: new Date(startYear, 8 - 1, 31, 23, 59, 59, 999),
      };
    }
  }
  ß;
}
