import SignInView from './SignInView';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '@src/store/auth';
import { UserSignInDto } from '@src/dto/request/User';
import { clearUserState, userSelector } from '@src/store';
import { useEffect } from 'react';

export interface ISignInForm extends UserSignInDto {}

export default function SignInContainer() {
  const dispatch = useDispatch();
  const { signInStatus, signInError } = useSelector(userSelector);

  useEffect(() => {
    return () => {
      dispatch(clearUserState());
    };
  }, []);

  const requestSignIn = (signInForm: ISignInForm) => {
    const userSignInDto = new UserSignInDto();
    userSignInDto.username = signInForm.username;
    userSignInDto.password = signInForm.password;
    dispatch(signIn(userSignInDto));
  };

  return (
    <SignInView
      onFinish={requestSignIn}
      error={signInError}
      signInStatus={signInStatus}
    />
  );
}
