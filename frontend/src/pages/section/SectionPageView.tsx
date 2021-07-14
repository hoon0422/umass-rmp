import { Rate, ResError, User, UserLevel } from '@dto/response';
import { HeaderContainer } from '@components';
import { Alert, Divider, Layout, Space } from 'antd';
import DescriptionContainer from './components/description';
import RateContainer from './components/rate';
import RateFormContainer from './components/rate-form';
import SummaryContainer from './components/summary';
import praseError from '@utils/praseError';

type props = {
  sectionId: number;
  rates: Rate[];
  editing: boolean;
  myRate?: Rate;
  userInfo?: User;
  getMyRateError?: ResError;
};

export default function SectionPageView({
  sectionId,
  rates,
  myRate,
  editing,
  userInfo,
  getMyRateError,
}: props) {
  let contentOfRates: JSX.Element;
  if (!userInfo) {
    // not logged in
    contentOfRates = (
      <Alert
        type="error"
        message="Please sign in to read or write rate of this section."
        showIcon
      />
    );
  } else {
    const rateForm = !!getMyRateError ? (
      <Alert
        type="error"
        message="The rate you wrote previously cannot be loaded. Reload the page."
        description={praseError({ error: getMyRateError })}
        showIcon
      />
    ) : myRate && !editing ? (
      <RateContainer rate={myRate} editable />
    ) : (
      <RateFormContainer defaultRate={myRate} />
    );

    if (userInfo.level < UserLevel.Rateable) {
      // not verified
      contentOfRates = (
        <>
          <Alert
            type="error"
            message="Please verify your account to read rates or write a new rate of this section."
            showIcon
          />
          <Divider />
          {myRate && rateForm}
        </>
      );
    } else if (userInfo.level < UserLevel.FullAccess) {
      // did not wrote rates >= 3
      contentOfRates = (
        <>
          {rateForm}
          <Divider />
          <Alert
            type="error"
            message="Please write more rates to read other rates."
            showIcon
          />
        </>
      );
    } else {
      // Full Access
      contentOfRates = (
        <>
          <SummaryContainer rates={rates} />
          <Divider />
          {rateForm}
          <Divider />
          {rates.map((rate, i) => (
            <RateContainer key={i} rate={rate} />
          ))}
        </>
      );
    }
  }

  return (
    <Layout>
      <HeaderContainer />
      <Layout.Content style={{ padding: '60px 50px' }}>
        <Space
          direction="vertical"
          style={{ padding: '24px', background: '#fff', width: '100%' }}
        >
          <DescriptionContainer sectionId={sectionId} />
          <Divider />
          {contentOfRates}
        </Space>
      </Layout.Content>
    </Layout>
  );
}
