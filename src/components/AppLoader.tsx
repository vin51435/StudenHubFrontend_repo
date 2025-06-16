import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { RootState } from '@src/redux/store'; // adjust the path
import { PropsWithChildren } from 'react';

const AppLoader: React.FC<PropsWithChildren> = ({ children }) => {
  const loading = useSelector((state: RootState) => state.ui.loading);

  return (
    <div className="app-loader relative h-screen min-h-screen">
      <div className="h-full" style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </div>
      {loading && <Spin fullscreen className="dark:bg-[var(--primary-dark)]" />}
    </div>
  );
};

export default AppLoader;
