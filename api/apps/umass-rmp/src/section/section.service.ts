import { Section } from '@models/entity/Section.entity';
import { User } from '@models/entity/User.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@rmp/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
  @InjectRepository(Section)
  private readonly sectionRepository: Repository<Section>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject()
  private readonly userService: UserService;

  static readonly messages = {
    userIdNotFound: 'There are no users with the specified user ID.',
    sectionIdNotFound: 'There are no sections with the specified section ID.',
    notVerifiedUser: 'Only verified user can access section info.',
  };

  async getSection(sectionId: number) {
    const section = this.sectionRepository.findOne(sectionId, {
      relations: [
        'category',
        'components',
        'course',
        'course.semester',
        'course.major',
        'professors',
        'location',
        'sectionTimes',
      ],
    });

    if (!section) {
      throw new NotFoundException([SectionService.messages.sectionIdNotFound]);
    }

    return section;
  }
}
