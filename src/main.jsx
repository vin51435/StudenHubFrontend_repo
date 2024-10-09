import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@src/assets/styles/main.scss';
import store from '@src/redux/store.js';
import { NotificationProvider } from './components/common/Notification.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </Provider>
    {/* </React.StrictMode> */}
  </>
);
