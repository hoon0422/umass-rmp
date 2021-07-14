import { useState } from 'react';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@dto/response';

export const getJwtUser = () => {
  const token = localStorage.getItem('accessToken');
  return (
    !!token &&
    (jwt.verify(token, process.env.REACT_APP_SECRET as string) as JwtPayload)
  );
};

export const createBearerToken = () => ({
  Authorization: !!localStorage.getItem('accessToken')
    ? `Bearer ${localStorage.getItem('accessToken')}`
    : undefined,
});

export const useAuthenticated = () => {
  const [authenticated] = useState(() => {
    try {
      return getJwtUser();
    } catch (error) {
      return false;
    }
  });

  return authenticated;
};
