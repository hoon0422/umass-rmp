import { Form, Select } from 'antd';
import { Major } from '.';

type props = {
  currentMajorId: number;
  setMajor: (majorId: number) => any;
  majors: Major[];
  width?: number;
};

export default function MajorDropdownView({
  majors,
  currentMajorId,
  setMajor,
  width = 140,
}: props) {
  return (
    <Form.Item label="Major" noStyle>
      <Select
        style={{ width }}
        defaultValue={currentMajorId}
        onChange={setMajor}
      >
        {majors.map((m, i) => (
          <Select.Option key={i} value={m.id}>
            {m.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
