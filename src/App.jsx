import React, { useEffect } from 'react';
import Routes from './routes/routes';
import { NotificationProvider } from './context/NotificationContext';

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
