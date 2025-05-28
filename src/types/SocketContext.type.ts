import { Socket } from 'socket.io-client';
import { NotificationType } from './enum';

export interface ReadNotification {}

export interface SocketContextType {
  socket: Socket | null;
  readNotification: (notificationIds: string[], type: NotificationType) => void;
}
