import {
  SearchContainer,
  AuthStateContainer,
  HeaderContainer,
} from '@components';
import { ResError } from '@dto/response';
import praseError from '@utils/praseError';
import { Space, Layout, Alert } from 'antd';
import BannerContainer from './components/banner';
import ResultTableContainer from './components/result-table';

type props = {
  showBanner: boolean;
  searchError?: ResError;
};

export default function HomePageView({ showBanner, searchError }: props) {
  const resultTable = (
    <Space
      hidden={showBanner}
      direction="vertical"
      style={{ width: '100%' }}
      align="center"
    >
      <ResultTableContainer />
    </Space>
  );

  if (showBanner) {
    return (
      <Layout style={{ height: '100%' }}>
        <Layout.Header
          style={{
            display: 'flex',
            position: 'fixed',
            zIndex: 1,
            width: '100%',
          }}
        >
          <Space style={{ marginLeft: 'auto' }}>
            <AuthStateContainer />
          </Space>
        </Layout.Header>
        <Layout.Content
          style={{ padding: '0 50px', marginTop: 64, height: '100%' }}
        >
          <BannerContainer>
            <SearchContainer containedInHeader={false} />
          </BannerContainer>
        </Layout.Content>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <HeaderContainer />
        <Layout.Content
          style={{ padding: '0 50px', marginTop: 64, height: '100vh' }}
        >
          {!searchError ? (
            resultTable
          ) : (
            <Alert
              type="error"
              message="Error"
              description={praseError({ error: searchError })}
              showIcon
            />
          )}
        </Layout.Content>
      </Layout>
    );
  }
}
