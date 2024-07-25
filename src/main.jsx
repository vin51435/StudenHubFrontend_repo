import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@src/assets/styles/main.scss';
import store from '@src/redux/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_YOUR_GOOGLE_CLIENT_ID}`} >
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
