import React from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { Provider } from 'react-redux';
import './App.css';
import '@src/assets/styles/main.scss';
import store from '@src/redux/store';
import RouterWrapper from '@src/routes';
import AppLoader from '@src/components/AppLoader';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppLoader>
        <NotificationProvider>
          <RouterWrapper />
        </NotificationProvider>
      </AppLoader>
    </Provider>
  );
};

export default App;
