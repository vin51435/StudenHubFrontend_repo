import { Socket } from "socket.io-client";
import { NotificationType } from "./enum";

export interface HandleReadNotificationType { userId: string; type: NotificationType; notificationId?: string | null }

export interface SocketContextType {
    socket: Socket | null;
    handleReadNotification: (notification: HandleReadNotificationType) => void;
}