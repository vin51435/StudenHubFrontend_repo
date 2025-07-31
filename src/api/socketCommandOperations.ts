import { deleteUserChats, updateUserChats } from '@src/redux/reducers/auth';
import { deleteChatId } from '@src/redux/reducers/cache/inbox.slice';
import store from '@src/redux/store';
import { INotif } from '@src/types/app';

type Command = {
  type: string;
  data: any;
};

class SockCommOp {
  static async processCommand(comm: Command) {
    if (comm.type === 'deleteChat') {
      store.dispatch(
        deleteUserChats({
          chatIds: [comm.data],
        })
      );
      store.dispatch(deleteChatId(comm.data));
    }
  }

  static async processNotif(notif: INotif) {
    console.log('notif', notif);
    if (notif.type === 'newChat') {
      store.dispatch(
        updateUserChats({
          chatIds: [notif.relatedChatId!],
        })
      );
    }
  }
}

export default SockCommOp;
