import { IsInt, IsString } from 'class-validator';
import { Major } from '../../../../libs/models/src/entity/Major.entity';

export class MajorResponseDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  static fromEntity(major: Major) {
    const majorResponseDto = new MajorResponseDto();

    majorResponseDto.id = major.id;
    majorResponseDto.name = major.name;

    return majorResponseDto;
  }
}
