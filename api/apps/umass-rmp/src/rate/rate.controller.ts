import { UserLevel } from '@models/entity/User.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@rmp/auth/guard/jwt-auth.guard';
import { RateEditDto, RateWriteDto } from '@rmp/dto/Rate';
import { UserBody } from '@rmp/dto/User';
import { AllowedUserLevel } from '@rmp/user/user-level.guard';
import { ReqUser } from '@rmp/utils/decorator';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  @Inject()
  private readonly rateService: RateService;

  @UseGuards(JwtAuthGuard)
  @Get('section/:sectionId/my-rate')
  async getMyRate(
    @Param('sectionId') sectionId: number,
    @ReqUser() user: UserBody,
  ) {
    return await this.rateService.getMyRate(sectionId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('section/:sectionId')
  @AllowedUserLevel(UserLevel.FullAccess)
  async getRates(
    @Param('sectionId') sectionId: number,
    @ReqUser() user: UserBody,
  ) {
    return await this.rateService.getRates(sectionId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('section/:sectionId')
  @AllowedUserLevel(UserLevel.Rateable)
  async writeRate(
    @Param('sectionId') sectionId: number,
    @ReqUser() user: UserBody,
    @Body() rateWriteDto: RateWriteDto,
  ) {
    const rate = await this.rateService.writeRate(
      sectionId,
      user.id,
      rateWriteDto,
    );
    if (!rate) {
      throw new InternalServerErrorException('Rate is not saved.');
    }
    return rate;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':rateId')
  async editRate(
    @Param('rateId') rateId: number,
    @Body() rateEditDto: RateEditDto,
    @ReqUser() user: UserBody,
  ) {
    const rate = await this.rateService.editRate(rateId, user.id, rateEditDto);
    if (!rate) {
      throw new InternalServerErrorException('Rate is not edited.');
    }
    return rate;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':rateId')
  async deleteRate(@Param('rateId') rateId: number, @ReqUser() user: UserBody) {
    const rate = await this.rateService.deleteRate(rateId, user.id);
    if (!rate) {
      throw new InternalServerErrorException('Rate is not deleted.');
    }
    return rate;
  }
}
