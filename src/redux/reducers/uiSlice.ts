import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
}

const initialState: UIState = {
  loading: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = uiSlice.actions;

const uiReducer = uiSlice.reducer;
export default uiReducer;
