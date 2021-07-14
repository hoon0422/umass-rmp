import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import { User } from '../../../../libs/models/src/entity/User.entity';
import { MajorResponseDto } from './Major';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  @MinLength(8, { message: 'Username must be minimum of 8 characters.' })
  @MaxLength(20, { message: 'Username must be maximum of 20 characters.' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  @MinLength(8, { message: 'Password must be minimum of 8 characters.' })
  @MaxLength(20, { message: 'Password must be maximum of 20 characters.' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  @MinLength(4, { message: 'Nickname must be minimum of 8 characters.' })
  @MaxLength(20, { message: 'Nickname must be maximum of 20 characters.' })
  nickname: string;

  @IsNotEmpty()
  @IsEmail()
  @Trim()
  email: string;

  @IsNotEmpty()
  @IsInt()
  majorId: number;

  static fromRequestBody(requestBody: any) {
    const userSignUpDto = new UserSignUpDto();
    if (requestBody) {
      userSignUpDto.username = requestBody.username || null;
      userSignUpDto.password = requestBody.password || null;
      userSignUpDto.passwordConfirmation =
        requestBody.passwordConfirmation || null;
      userSignUpDto.nickname = requestBody.nickname || null;
      userSignUpDto.email = requestBody.email || null;
      userSignUpDto.majorId = requestBody.majorId || null;
    }
    return userSignUpDto;
  }
}

export class UserResponseDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @Type(() => MajorResponseDto)
  major: MajorResponseDto;

  @IsInt()
  level: number;

  static fromEntity(user: User) {
    const userResponseDto = new UserResponseDto();

    userResponseDto.id = user.id;
    userResponseDto.username = user.username;
    userResponseDto.nickname = user.nickname;
    userResponseDto.email = user.email;
    userResponseDto.major = MajorResponseDto.fromEntity(user.major);
    userResponseDto.level = user.level;

    return userResponseDto;
  }
}

export interface UserBody {
  id?: number;
  level?: number;
}
