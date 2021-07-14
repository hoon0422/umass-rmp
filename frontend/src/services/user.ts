import { User } from '@dto/response';
import { createBearerToken } from '@utils/auth';
import axios from 'axios';

export const loadCurrentUserInfo = async () => {
  const response = await axios.post<User>('/auth/current-user', null, {
    headers: createBearerToken(),
    withCredentials: true,
  });
  return response.data as User;
};
