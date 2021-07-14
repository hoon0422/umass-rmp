import { Rate } from '@dto/response';
import {
  Card,
  Rate as StarRate,
  Divider,
  Button,
  Descriptions,
  Space,
} from 'antd';
import styled from 'styled-components';

const RateTitle = styled.div`
  display: flex;
  direction: horizontal;
  justify-items: center;
  align-items: flex-end;
`;

const UserNickname = styled.div`
  font-size: 20px;
`;

const UserMajor = styled.div`
  margin-left: auto;
  font-size: 14px;
  color: #757575;
`;

const scoreFields = [
  { field: 'Overall', name: 'overallScore' },
  { field: 'How easy it was', name: 'easyness' },
  { field: 'How much I learned', name: 'learned' },
  { field: 'How good teaching was', name: 'teaching' },
];

type props = {
  rate: Rate;
  startEditing?: () => any;
};

export default function RateView({ rate, startEditing }: props) {
  return (
    <Card
      title={
        <RateTitle>
          <UserNickname>{rate.user.nickname}</UserNickname>
          <UserMajor>{rate.user.major.name}</UserMajor>
        </RateTitle>
      }
    >
      <Descriptions
        bordered
        size="small"
        title="Score"
        column={2}
        colon={false}
      >
        {scoreFields.map((sf, i) => (
          <Descriptions.Item key={i} label={sf.field}>
            <StarRate
              disabled
              defaultValue={(rate as { [x: string]: any })[sf.name]}
            />
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Divider />
      <p>{rate.rate}</p>
      <Divider />
      {!!startEditing && (
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button htmlType="button" type="primary" onClick={startEditing}>
            Update
          </Button>
        </Space>
      )}
    </Card>
  );
}
