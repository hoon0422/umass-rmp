import { Form, Row, Col, Space } from 'antd';
import FieldDropdownContainer from './field-dropdown';
import InputContainer from './input';
import MajorDropdownContainer from './major-dropdown';

type props = {
  isHeader: boolean;
};

export default function SearchView({ isHeader }: props) {
  const fieldDropdown = (
    <FieldDropdownContainer width={isHeader ? 140 : undefined} />
  );
  const majorDropdown = (
    <MajorDropdownContainer width={isHeader ? 140 : undefined} />
  );
  const inputSearch = <InputContainer width={isHeader ? 300 : '100%'} />;

  if (isHeader) {
    return (
      <Form style={{ display: 'flex', alignItems: 'center' }}>
        <Space>
          {inputSearch}
          {fieldDropdown}
          {majorDropdown}
        </Space>
      </Form>
    );
  }

  return (
    <Form style={{ width: 400 }}>
      <Row gutter={[16, 16]} justify="space-around" align="middle">
        <Col span={3} style={{ textAlign: 'left' }}>
          Field
        </Col>
        <Col span={8}>{fieldDropdown}</Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          Major
        </Col>
        <Col span={9}>{majorDropdown}</Col>
        <Col span={24}>{inputSearch}</Col>
      </Row>
    </Form>
  );
}
