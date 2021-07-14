import { ResError, Rate as RateResponseDto } from '@dto/response';
import {
  Form,
  Card,
  Space,
  Rate,
  Divider,
  Input,
  Button,
  Descriptions,
  Alert,
} from 'antd';
import { RateForm } from '.';

type props = {
  defaultRate?: RateResponseDto;
  onCancel: () => any;
  onPostFinish: (rateForm: RateForm) => any;
  writeRateStatus: 'pending' | 'fulfilled' | 'rejected';
  editRateStatus: 'pending' | 'fulfilled' | 'rejected';
  writeRateError?: ResError;
  editRateError?: ResError;
};

export default function RateFormView({
  defaultRate,
  onPostFinish,
  onCancel,
  writeRateStatus,
  editRateStatus,
  writeRateError,
  editRateError,
}: props) {
  const scoreFields = [
    {
      label: 'Overall',
      property: 'overallScore',
      value: defaultRate ? defaultRate.overallScore : 0,
    },
    {
      label: 'How easy it was',
      property: 'easyness',
      value: defaultRate ? defaultRate.easyness : 0,
    },
    {
      label: 'How much I learned',
      property: 'learned',
      value: defaultRate ? defaultRate.learned : 0,
    },
    {
      label: 'How good teaching was',
      property: 'teaching',
      value: defaultRate ? defaultRate.teaching : 0,
    },
  ];
  const error = writeRateError || editRateError;

  return (
    <Card title="Rate the course if you have taken it!">
      <Form
        onFinish={(rateForm) => onPostFinish(rateForm)}
        initialValues={scoreFields.reduce((acc, sf) =>
          Object.assign(acc, { [sf.property]: sf.value }),
        )}
      >
        <Descriptions
          title="Score"
          size="small"
          bordered
          column={2}
          colon={false}
        >
          {scoreFields.map((sf, i) => (
            <Descriptions.Item key={i} label={sf.label}>
              <Form.Item name={sf.property} noStyle initialValue={sf.value}>
                <Rate />
              </Form.Item>
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Divider />
        <Form.Item
          name="rate"
          initialValue={defaultRate ? defaultRate.rate : ''}
        >
          <Input.TextArea
            rows={6}
            maxLength={10000}
            placeholder="Write details about the course!"
            showCount
          />
        </Form.Item>
        {error && (
          <Alert
            style={{ marginTop: '20px' }}
            type="error"
            message={error.message.join('\n')}
          />
        )}
        <Divider />
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              writeRateStatus === 'pending' || editRateStatus === 'pending'
            }
          >
            Post
          </Button>
          <Button
            htmlType="button"
            onClick={onCancel}
            disabled={
              writeRateStatus === 'pending' || editRateStatus === 'pending'
            }
          >
            Cancel
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
