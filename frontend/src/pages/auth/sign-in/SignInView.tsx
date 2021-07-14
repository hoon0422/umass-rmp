import { ResError } from '@src/dto/response/Error';
import praseError from '@src/utils/praseError';
import { Alert, Button, Form, Input, Space } from 'antd';
import { ISignInForm } from './SignInContainer';

type props = {
  onFinish: (signInForm: ISignInForm) => any;
  error?: ResError;
  signInStatus: 'pending' | 'fulfilled' | 'rejected';
};

export default function SignInView({ onFinish, error, signInStatus }: props) {
  return (
    <Form
      colon={false}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please enter your username.',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please enter your password.',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {!!error && (
        <Alert
          type="error"
          message="Error"
          description={praseError({ error })}
          showIcon
        />
      )}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={signInStatus === 'pending'}
          >
            Sign In
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
