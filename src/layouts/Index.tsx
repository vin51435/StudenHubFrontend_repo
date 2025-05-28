import { ModalProvider } from '@src/contexts/Model.context';
import { SocketProvider } from '@src/contexts/Socket.context';
import MainLayout from '@src/layouts/main.layout';

const AppLayout = () => {
  return (
    <SocketProvider>
      <ModalProvider>
        <MainLayout />
      </ModalProvider>
    </SocketProvider>
  );
};

export default AppLayout;
