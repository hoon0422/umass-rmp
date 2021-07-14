import { ResError } from '@src/dto/response/Error';
import { Major } from '@src/dto/response/Major';
import praseError from '@src/utils/praseError';
import { Alert, Button, Form, Input, Select, Space } from 'antd';
import { ISignUpForm } from './SignUpContainer';

type props = {
  onFinish: (signUpForm: ISignUpForm) => any;
  majors: Major[];
  signUpStatus: 'pending' | 'fulfilled' | 'rejected';
  error?: ResError;
};
export default function SignUpView({
  majors,
  onFinish,
  signUpStatus,
  error,
}: props) {
  const majorIds = new Set(majors.map((m) => m.id));
  return (
    <Form
      colon={false}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
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
      <Form.Item
        name="passwordConfirmation"
        label="Confirm Password"
        rules={[
          {
            required: true,
            message: 'Please enter password confirmation.',
          },
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two Passwords that you entered do not match.'),
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="nickname"
        label="Nickname"
        rules={[
          {
            required: true,
            message: 'Please enter your nickname.',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="UMass Email"
        rules={[
          {
            required: true,
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@umass.edu$/,
            message: 'Please enter your UMass Email.',
          },
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        name="majorId"
        label="Major"
        rules={[
          {
            required: true,
            type: 'number',
            min: 1,
            message: 'Please select your major.',
          },
          {
            validator: (_, value: number) => {
              return majorIds.has(value)
                ? Promise.resolve()
                : Promise.reject(
                    new Error('The major ID is not valid. Reload the page.'),
                  );
            },
          },
        ]}
      >
        <Select style={{ width: '100%' }}>
          {majors.map((m, i) => (
            <Select.Option key={i} value={m.id}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
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
            disabled={signUpStatus === 'pending'}
          >
            Sign Up
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
