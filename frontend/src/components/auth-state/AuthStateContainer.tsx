import { userSelector } from '@store';
import { useSelector } from 'react-redux';
import AuthStateView from './AuthStateView';

export default function AuthStateContainer() {
  const { jwtUser } = useSelector(userSelector);
  return <AuthStateView jwtUser={jwtUser} />;
}
