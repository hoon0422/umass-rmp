import { Form, Input } from 'antd';

type props = {
  defaultInput: string;
  setInput: (value: string) => any;
  search: () => any;
  width?: number | string;
};

export default function InputView({
  defaultInput,
  setInput,
  search,
  width = 280,
}: props) {
  return (
    <Form.Item
      noStyle
      rules={[
        {
          required: true,
          min: 3,
          type: 'string',
          message: 'The minimum length of the search input is 3.',
        },
      ]}
    >
      <Input.Search
        style={{ width }}
        defaultValue={defaultInput}
        placeholder="Search"
        onChange={(e) => setInput(e.target.value)}
        onSearch={search}
        enterButton
      />
    </Form.Item>
  );
}
