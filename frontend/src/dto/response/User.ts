import { Major } from './Major';
import * as jwt from 'jsonwebtoken';

export enum UserLevel {
  NotVerified = 0,
  Rateable = 1,
  FullAccess = 2,
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  major: Major;
  level: UserLevel;
}

export interface JwtPayload extends jwt.JwtPayload {
  id: number;
  nickname: string;
}
