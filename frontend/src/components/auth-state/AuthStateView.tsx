import { JwtPayload } from '@dto/response';
import { getAuthPath, getAuthSignOutPath } from '@navigation';
import { Button, Space } from 'antd';
import { Link } from 'react-router-dom';

type props = {
  jwtUser?: JwtPayload;
};

export default function AuthStateView({ jwtUser }: props) {
  return (
    <Space>
      {!!jwtUser ? (
        <>
          <Space
            style={{
              color: 'white',
              marginRight: '20px',
              marginLeft: '20px',
              fontSize: '1.1rem',
            }}
          >
            {jwtUser.nickname}
          </Space>
          <Link to={getAuthSignOutPath()}>
            <Button type="link" htmlType="button">
              Sign Out
            </Button>
          </Link>
        </>
      ) : (
        <Link to={getAuthPath()}>
          <Button htmlType="button">Sign In / Sign Up</Button>
        </Link>
      )}
    </Space>
  );
}
