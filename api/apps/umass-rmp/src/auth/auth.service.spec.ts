import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserSignUpDto } from '@rmp/dto/User';
import { compareSync, hashSync } from 'bcrypt';
import { AuthService } from './auth.service';
import { createMockRepository, MockRepository } from '@rmp/utils/mock';
import { BadRequestException } from '@nestjs/common';
import { User, UserLevel } from '@models/entity/User.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Major } from '@models/entity/Major.entity';

describe('AuthService', () => {
  let service: AuthService;
  let majorRepository: MockRepository<Major>;
  let userRepository: MockRepository<User>;

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
        PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('SECRET'),
            signOptions: {
              expiresIn: '1h',
            },
          }),
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(Major),
          useValue: createMockRepository<Major>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    majorRepository = module.get<MockRepository<Major>>(
      getRepositoryToken(Major),
    );
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const dummyMajor = new Major();
    dummyMajor.name = 'dummy major';

    it('should register a user with valid inputs', async () => {
      const validUserDTO = new UserSignUpDto();
      validUserDTO.username = 'validusername';
      validUserDTO.password = 'validpassword';
      validUserDTO.passwordConfirmation = 'validpassword';
      validUserDTO.nickname = 'validnickname';
      validUserDTO.email = 'validemail@umass.edu';
      validUserDTO.majorId = dummyMajor.id;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(dummyMajor)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      // save(validUserDTO): save a user with the given valid user DTO.
      const expectedSavedUser = new User();
      expectedSavedUser.username = validUserDTO.username;
      expectedSavedUser.password = hashSync(validUserDTO.password, 10);
      expectedSavedUser.nickname = validUserDTO.nickname;
      expectedSavedUser.email = validUserDTO.email;
      expectedSavedUser.major = dummyMajor;
      expectedSavedUser.level = UserLevel.NotVerified;
      userRepository.save.mockResolvedValueOnce(expectedSavedUser);

      try {
        const savedUser = await service.register(validUserDTO);
        expect(majorRepository.findOne).toBeCalledTimes(2);
        expect(userRepository.findOne).toBeCalledTimes(2);
        expect(userRepository.save).toBeCalledTimes(1);
        expect(savedUser.username).toEqual(validUserDTO.username);
        expect(savedUser.nickname).toEqual(validUserDTO.nickname);
        expect(savedUser.email).toEqual(validUserDTO.email);
        expect(savedUser.level).toEqual(UserLevel.NotVerified);
        expect(savedUser.major.name).toEqual(dummyMajor.name);
        expect(compareSync(validUserDTO.password, savedUser.password)).toBe(
          true,
        );
      } catch (error) {
        fail(error);
      }
    });

    it('should fail registering a user with invalid password confirmation.', async () => {
      const invalidUserDTO = new UserSignUpDto();
      invalidUserDTO.username = 'validusername';
      invalidUserDTO.password = 'validpassword';
      invalidUserDTO.passwordConfirmation = 'invalidpasswordconfirmation';
      invalidUserDTO.nickname = 'validnickname';
      invalidUserDTO.email = 'validemail@umass.edu';
      invalidUserDTO.majorId = dummyMajor.id;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(dummyMajor)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      try {
        await service.register(invalidUserDTO);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBeDefined();
        expect(error.response.message).toContainEqual(
          AuthService.messages.invalidPasswordConfirmation,
        );
        Object.values(AuthService.messages)
          .filter((m) => m !== AuthService.messages.invalidPasswordConfirmation)
          .forEach((m) => expect(error.response.message).not.toContainEqual(m));
        expect(userRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should fail registering a user with username which already exists.', async () => {
      const invalidUserDTO = new UserSignUpDto();
      invalidUserDTO.username = 'sameusername';
      invalidUserDTO.password = 'validpassword';
      invalidUserDTO.passwordConfirmation = 'validpassword';
      invalidUserDTO.nickname = 'validnickname';
      invalidUserDTO.email = 'validemail@umass.edu';
      invalidUserDTO.majorId = dummyMajor.id;

      const savedUser = new User();
      savedUser.username = invalidUserDTO.username;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(dummyMajor)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(savedUser)
        .mockResolvedValueOnce(undefined);

      try {
        await service.register(invalidUserDTO);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBeDefined();
        expect(error.response.message).toContainEqual(
          AuthService.messages.usernameAlreadyExists,
        );
        Object.values(AuthService.messages)
          .filter((m) => m !== AuthService.messages.usernameAlreadyExists)
          .forEach((m) => expect(error.response.message).not.toContainEqual(m));
        expect(userRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should fail registering a user with nickname which already exists.', async () => {
      const invalidUserDTO = new UserSignUpDto();
      invalidUserDTO.username = 'validusername';
      invalidUserDTO.password = 'validpassword';
      invalidUserDTO.passwordConfirmation = 'validpassword';
      invalidUserDTO.nickname = 'samenickname';
      invalidUserDTO.email = 'validemail@umass.edu';
      invalidUserDTO.majorId = dummyMajor.id;

      const savedUser = new User();
      savedUser.nickname = invalidUserDTO.nickname;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(dummyMajor)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(savedUser);

      try {
        await service.register(invalidUserDTO);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBeDefined();
        expect(error.response.message).toContainEqual(
          AuthService.messages.nicknameAlreadyExists,
        );
        Object.values(AuthService.messages)
          .filter((m) => m !== AuthService.messages.nicknameAlreadyExists)
          .forEach((m) => expect(error.response.message).not.toContainEqual(m));
        expect(userRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should fail registering a user with email not at UMass', async () => {
      const invalidUserDTO = new UserSignUpDto();
      invalidUserDTO.username = 'validusername';
      invalidUserDTO.password = 'validpassword';
      invalidUserDTO.passwordConfirmation = 'validpassword';
      invalidUserDTO.nickname = 'validdnickname';
      invalidUserDTO.email = 'invalidemail@website.com';
      invalidUserDTO.majorId = dummyMajor.id;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(dummyMajor)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      try {
        await service.register(invalidUserDTO);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBeDefined();
        expect(error.response.message).toContainEqual(
          AuthService.messages.notUMassEmail,
        );
        Object.values(AuthService.messages)
          .filter((m) => m !== AuthService.messages.notUMassEmail)
          .forEach((m) => expect(error.response.message).not.toContainEqual(m));
        expect(userRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should fail registering a user with invalid major ID', async () => {
      const invalidUserDTO = new UserSignUpDto();
      invalidUserDTO.username = 'validusername';
      invalidUserDTO.password = 'validpassword';
      invalidUserDTO.passwordConfirmation = 'validpassword';
      invalidUserDTO.nickname = 'validdnickname';
      invalidUserDTO.email = 'validemail@umass.edu';
      invalidUserDTO.majorId = dummyMajor.id + 1000;

      // findOne(majorId): find a major with the given majorId.
      majorRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(dummyMajor);

      // findOne({ usernname }), findOne({ nickname }):
      // check whether username and nickname already exist.
      userRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      try {
        await service.register(invalidUserDTO);
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.message).toBeDefined();
        expect(error.response.message).toContainEqual(
          AuthService.messages.invalidMajorId,
        );
        Object.values(AuthService.messages)
          .filter((m) => m !== AuthService.messages.invalidMajorId)
          .forEach((m) => expect(error.response.message).not.toContainEqual(m));
        expect(userRepository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user with existing username and valid password', async () => {
      const inputUsername = 'existingusername';
      const inputPassword = 'validpassword';
      const existingUser = new User();
      existingUser.username = inputUsername;
      existingUser.password = hashSync(inputPassword, 10);
      userRepository.findOne.mockResolvedValueOnce(existingUser);

      try {
        const authenticatedUser = await service.authenticate(
          inputUsername,
          inputPassword,
        );
        expect(userRepository.findOne).toBeCalledTimes(1);
        expect(authenticatedUser).toBeTruthy();
        expect(authenticatedUser.username).toEqual(inputUsername);
        expect(authenticatedUser.password).toEqual('');
      } catch (err) {
        fail(err);
      }
    });

    it('should not authenticate a user with invalid username', async () => {
      const inputUsername = 'invalidusername';
      const inputPassword = 'password';
      userRepository.findOne.mockResolvedValueOnce(undefined);

      try {
        const authenticatedUser = await service.authenticate(
          inputUsername,
          inputPassword,
        );
        expect(userRepository.findOne).toBeCalledTimes(1);
        expect(authenticatedUser).toBeFalsy();
      } catch (err) {
        fail(err);
      }
    });
    it('should not authenticate a user with valid username and invalid password', async () => {
      const inputUsername = 'existingusername';
      const inputPassword = 'invalidpassword';
      const password = 'password';
      const existingUser = new User();
      existingUser.username = inputUsername;
      existingUser.password = hashSync(password, 10);
      userRepository.findOne.mockResolvedValueOnce(existingUser);

      try {
        const authenticatedUser = await service.authenticate(
          inputUsername,
          inputPassword,
        );
        expect(userRepository.findOne).toBeCalledTimes(1);
        expect(authenticatedUser).toBeFalsy();
      } catch (err) {
        fail(err);
      }
    });
  });
});
