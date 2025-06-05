import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post } from '@src/libs/apiConfig';
import { IUser } from '@src/types/app';

export interface InboxState {
  chatId: string | null;
  participantData: IUser | null;
}

const initialState: { chats: InboxState[]; chatsLoading: boolean } = {
  chats: [],
  chatsLoading: true,
};

export const fetchInbox = createAsyncThunk('inbox/chats', async (chatIds: string[]) => {
  const res = await post<{ chats: { chatId: string; secondParticipant: IUser }[] }>(
    'GET_INBOX_PARTICIPANTS',
    {
      BASE_URLS: 'user',
      data: { chatIds },
    }
  );
  return res;
});

const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInbox.pending, (state) => {
        state.chatsLoading = true;
      })
      .addCase(fetchInbox.fulfilled, (state, action) => {
        state.chats =
          action.payload?.data?.chats?.map((chat: any) => ({
            chatId: chat.chatId,
            participantData: chat.secondParticipant,
          })) ?? [];
        state.chatsLoading = false;
      })
      .addCase(fetchInbox.rejected, (state) => {
        state.chatsLoading = false;
      });
  },
});

const inboxReducer = inboxSlice.reducer;
export default inboxReducer;
