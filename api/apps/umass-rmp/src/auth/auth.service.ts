import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { UserResponseDto, UserSignUpDto } from '@rmp/dto/User';
import { JwtService } from '@nestjs/jwt';
import { User } from '@models/entity/User.entity';
import { Major } from '@models/entity/Major.entity';
import { classToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  @InjectRepository(Major) private readonly majorRepository: Repository<Major>;

  @Inject() private readonly jwtService: JwtService;

  @Inject() private readonly configService: ConfigService;

  static readonly messages = {
    invalidPasswordConfirmation:
      'Password confirmation must be equal to password',
    usernameAlreadyExists: 'Username already exists',
    nicknameAlreadyExists: 'Nickname already exists',
    notUMassEmail: 'Only user with UMass email can register',
    invalidMajorId: 'Invalid major id',
  };

  async register(userSignUpDto: UserSignUpDto) {
    const errorMessages: string[] = [];

    if (!this.isPasswordConfirmationPassed(userSignUpDto)) {
      errorMessages.push(AuthService.messages.invalidPasswordConfirmation);
    }

    if (await this.usernameAlreadyExists(userSignUpDto)) {
      errorMessages.push(AuthService.messages.usernameAlreadyExists);
    }

    if (await this.nicknameAlreadyExists(userSignUpDto)) {
      errorMessages.push(AuthService.messages.nicknameAlreadyExists);
    }

    if (!this.isEmailAtUMass(userSignUpDto)) {
      errorMessages.push(AuthService.messages.notUMassEmail);
    }

    if (!(await this.isMajorIdValid(userSignUpDto))) {
      errorMessages.push(AuthService.messages.invalidMajorId);
    }

    if (errorMessages.length !== 0) {
      throw new BadRequestException(errorMessages);
    }

    return await this.userRepository.save(await this.toEntity(userSignUpDto));
  }

  async getCurrentUser(accessToken: string) {
    const user = (await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('SECRET'),
    })) as User;
    return await this.userRepository.findOne(user.id);
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ username });
    if (user && (await compare(password, user.password))) {
      user.password = '';
      return user;
    }
    return null;
  }

  async login(user: User) {
    return await this.jwtService.signAsync(
      classToPlain<UserResponseDto>(UserResponseDto.fromEntity(user)),
    );
  }

  private isPasswordConfirmationPassed(userSignUpDto: UserSignUpDto): boolean {
    return userSignUpDto.passwordConfirmation === userSignUpDto.password;
  }

  private async usernameAlreadyExists(
    userSignUpDto: UserSignUpDto,
  ): Promise<boolean> {
    return !!(await this.userRepository.findOne({
      username: userSignUpDto.username,
    }));
  }

  private async nicknameAlreadyExists(
    userSignUpDto: UserSignUpDto,
  ): Promise<boolean> {
    return !!(await this.userRepository.findOne({
      nickname: userSignUpDto.nickname,
    }));
  }

  private isEmailAtUMass(userSignUpDto: UserSignUpDto): boolean {
    return userSignUpDto.email.split('@')[1].toLowerCase() === 'umass.edu';
  }

  private async isMajorIdValid(userSignUpDto: UserSignUpDto): Promise<boolean> {
    return !!(await this.majorRepository.findOne(userSignUpDto.majorId));
  }

  private async toEntity(userSignUpDto: UserSignUpDto) {
    const user = new User();
    user.username = userSignUpDto.username;
    user.password = await hash(userSignUpDto.password, 10);
    user.nickname = userSignUpDto.nickname;
    user.email = userSignUpDto.email;
    user.major = await this.majorRepository.findOne(userSignUpDto.majorId);
    return user;
  }
}
