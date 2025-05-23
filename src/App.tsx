import React from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { Provider } from 'react-redux';
import './App.css';
import '@src/assets/styles/main.scss';
import store from '@src/redux/store';
import RouterWrapper from '@src/routes';
import AppLoader from '@src/components/AppLoader';
import { ThemeProvider } from '@src/theme/ThemeProvider';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppLoader>
          <NotificationProvider>
            <RouterWrapper />
          </NotificationProvider>
        </AppLoader>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
