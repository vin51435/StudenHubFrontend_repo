import React from 'react';
import Routes from './routes/routes';
import { NotificationProvider } from './components/context/NotificationContext';

function App() {

  return (
    <>
      <NotificationProvider>
        <Routes />
      </NotificationProvider>
    </>
  );
}

export default App;
