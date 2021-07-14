export class UserSignUpDto {
  username: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
  email: string;
  majorId: number;
}

export class UserSignInDto {
  username: string;
  password: string;
}

export interface UserBody {
  id?: number;
  level?: number;
}
