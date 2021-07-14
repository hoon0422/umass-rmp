import { FieldType } from '@dto/request';
import { SearchField } from '@dto/response';
import { Form, Select } from 'antd';

type props = {
  fields: SearchField[];
  currentField: FieldType;
  setField: (field: FieldType) => any;
  width?: number;
};

export default function FieldDropdownView({
  fields,
  currentField,
  setField,
  width = 140,
}: props) {
  return (
    <Form.Item label="Field" noStyle>
      <Select style={{ width }} defaultValue={currentField} onChange={setField}>
        {fields.map((f, i) => (
          <Select.Option key={i} value={f.value}>
            {f.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
