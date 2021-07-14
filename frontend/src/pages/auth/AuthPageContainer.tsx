import { getHomePath } from '@src/navigation';
import { userSelector } from '@src/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AuthPageView from './AuthPageView';

export default function AuthPageContainer() {
  const { jwtUser } = useSelector(userSelector);
  const [page, setPage] = useState('sign-in' as 'sign-in' | 'sign-up');

  if (!!jwtUser) {
    return <Redirect to={getHomePath()} />;
  }
  return (
    <AuthPageView
      page={page}
      togglePage={() => setPage(page === 'sign-in' ? 'sign-up' : 'sign-in')}
    />
  );
}
