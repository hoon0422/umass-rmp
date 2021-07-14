import { Rate } from '@models/entity/Rate.entity';
import { Section } from '@models/entity/Section.entity';
import { User } from '@models/entity/User.entity';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RateEditDto, RateWriteDto } from '@rmp/dto/Rate';
import { UserService } from '@rmp/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RateService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Section)
  private readonly sectionRepository: Repository<Section>;

  @InjectRepository(Rate)
  private readonly rateRepository: Repository<Rate>;

  @Inject(UserService)
  private readonly userService: UserService;

  static readonly messages = {
    userIdNotFound: 'There are no users with the specified user ID.',
    sectionIdNotFound: 'There are no sections with the specified section ID.',
    rateIdNotFound: 'There are no rates with the specified rate ID.',
    rateNotWrittenByUser:
      'The specified rate is not written by the specified user.',
    userWithoutFullAccess: 'Only user with "full access" level can read rates.',
    userWithoutRateable: 'Only user with "rateable" level can write a rate.',
  };

  async getRates(sectionId: number, userId: number) {
    if (!(await this.userRepository.findOne(userId))) {
      throw new NotFoundException([RateService.messages.userIdNotFound]);
    }

    if (!(await this.userService.isUserAuthorizedToReadRates(userId))) {
      throw new ForbiddenException([
        RateService.messages.userWithoutFullAccess,
      ]);
    }

    return await this.rateRepository.find({
      relations: ['user'],
      where: {
        section: { id: sectionId },
      },
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getMyRate(sectionId: number, userId: number) {
    if (!(await this.userRepository.findOne(userId))) {
      throw new NotFoundException([RateService.messages.userIdNotFound]);
    }

    return await this.rateRepository.findOne({
      relations: ['user'],
      where: {
        section: { id: sectionId },
        user: { id: userId },
      },
    });
  }

  async writeRate(
    sectionId: number,
    userId: number,
    rateWriteDto: RateWriteDto,
  ) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException([RateService.messages.userIdNotFound]);
    }

    if (!(await this.userService.isUserAuthorizedToWriteRate(userId))) {
      throw new ForbiddenException([RateService.messages.userWithoutRateable]);
    }

    const section = await this.sectionRepository.findOne(sectionId);
    if (!section) {
      throw new NotFoundException([RateService.messages.sectionIdNotFound]);
    }

    const rate = new Rate();
    rate.user = user;
    rate.section = section;
    rate.overallScore = rateWriteDto.overallScore;
    rate.learned = rateWriteDto.learned;
    rate.easyness = rateWriteDto.easyness;
    rate.teaching = rateWriteDto.teaching;
    rate.rate = rateWriteDto.rate;
    const savedRate = await this.rateRepository.save(rate);
    await this.userService.updateUserLevelOfVerifiedUser(userId);
    return savedRate;
  }

  async editRate(rateId: number, userId: number, rateEditDto: RateEditDto) {
    const rate = await this.rateRepository.findOne(rateId);
    if (!rate) {
      throw new NotFoundException([RateService.messages.rateIdNotFound]);
    }

    if (rate.user.id !== userId) {
      throw new ForbiddenException([RateService.messages.rateNotWrittenByUser]);
    }

    rate.overallScore = rateEditDto.overallScore || rate.overallScore;
    rate.learned = rateEditDto.learned || rate.learned;
    rate.easyness = rateEditDto.easyness || rate.easyness;
    rate.teaching = rateEditDto.teaching || rate.teaching;
    rate.rate = rateEditDto.rate || rate.rate;
    return await this.rateRepository.save(rate);
  }

  async deleteRate(rateId: number, userId: number) {
    const rate = await this.rateRepository.findOne(rateId);
    if (!rate) {
      throw new NotFoundException([RateService.messages.rateIdNotFound]);
    }

    if (rate.user.id !== userId) {
      throw new ForbiddenException([RateService.messages.rateNotWrittenByUser]);
    }

    return await this.rateRepository.remove(rate);
  }
}
