import { Layout, Space } from 'antd';
import AuthStateContainer from '../auth-state';
import SearchContainer from '../search';
const { Header } = Layout;

export default function HeaderView() {
  return (
    <Header
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          float: 'left',
          width: '120px',
          height: '31px',
          minWidth: '120px',
          minHeight: '31px',
          marginRight: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
      {/* For logo */}
      <SearchContainer containedInHeader />
      <Space style={{ marginLeft: 'auto' }}>
        <AuthStateContainer />
      </Space>
    </Header>
  );
}
