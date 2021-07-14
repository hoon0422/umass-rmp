import { UserSignInDto, UserSignUpDto } from '@dto/request';
import { JwtPayload } from '@dto/response';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';

export const signIn = async (userSignInDto: UserSignInDto) => {
  const response = await axios.post<{ accessToken: string }>(
    '/auth/sign-in',
    classToPlain<UserSignInDto>(userSignInDto),
  );
  localStorage.setItem('accessToken', response.data.accessToken);
  return jwt.verify(
    response.data.accessToken,
    process.env.REACT_APP_SECRET as string,
  ) as JwtPayload;
};

export const signUp = async (userSignUpDto: UserSignUpDto) => {
  const response = await axios.post<{ accessToken: string }>(
    '/auth/sign-up',
    classToPlain<UserSignUpDto>(userSignUpDto),
  );
  new Cookies().set('accessToken', response.data.accessToken);
  return jwt.verify(
    response.data.accessToken,
    process.env.REACT_APP_SECRET as string,
  ) as JwtPayload;
};
