import { UserSignUpDto } from '@src/dto/request/User';
import { Major } from '@src/dto/response/Major';
import { loadMajors } from '@src/services/search';
import { clearUserState, userSelector } from '@src/store';
import { signUp } from '@src/store/auth';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignUpView from './SignUpView';

export interface ISignUpForm extends UserSignUpDto {}

export default function SignUpContainer() {
  const [majors, setMajors] = useState([] as Major[]);
  const dispatch = useDispatch();
  const { signUpStatus, signUpError } = useSelector(userSelector);

  useEffect(() => {
    return () => {
      dispatch(clearUserState());
    };
  }, []);
  const requestSignUp = (signUpForm: ISignUpForm) => {
    const userSignUpDto = new UserSignUpDto();
    userSignUpDto.username = signUpForm.username;
    userSignUpDto.password = signUpForm.password;
    userSignUpDto.passwordConfirmation = signUpForm.passwordConfirmation;
    userSignUpDto.nickname = signUpForm.nickname;
    userSignUpDto.email = signUpForm.email;
    userSignUpDto.majorId = signUpForm.majorId;
    dispatch(signUp(userSignUpDto));
  };

  useEffect(() => {
    loadMajors().then(setMajors);
  }, []);
  return (
    <SignUpView
      majors={majors}
      onFinish={requestSignUp}
      signUpStatus={signUpStatus}
      error={signUpError}
    />
  );
}
