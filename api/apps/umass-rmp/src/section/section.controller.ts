import { UserLevel } from '@models/entity/User.entity';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AllowedUserLevel } from '@rmp/user/user-level.guard';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
  @Inject() private readonly sectionService: SectionService;

  @Get(':sectionId')
  @AllowedUserLevel(UserLevel.Rateable)
  async getSection(@Param('sectionId') sectionId: number) {
    return this.sectionService.getSection(sectionId);
  }
}
