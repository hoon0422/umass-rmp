import { Button, Card, Layout, Space } from 'antd';
import SignInContainer from './sign-in';
import SignUpContainer from './sign-up';

type props = {
  page: 'sign-in' | 'sign-up';
  togglePage: () => any;
};

export default function AuthPageView({ page, togglePage }: props) {
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Content>
        <Space
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          {page === 'sign-in' ? (
            <Card
              title="Sign In"
              extra={
                <Button type="link" htmlType="button" onClick={togglePage}>
                  Sign up
                </Button>
              }
            >
              <SignInContainer />
            </Card>
          ) : (
            <Card
              title="Sign Up"
              extra={
                <Button type="link" htmlType="button" onClick={togglePage}>
                  Sign in
                </Button>
              }
            >
              <SignUpContainer />
            </Card>
          )}
        </Space>
      </Layout.Content>
    </Layout>
  );
}
