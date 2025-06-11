import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { setLoading } from '@src/redux/reducers/uiSlice';
import { RootState } from '@src/redux/store';

export function useLoader() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.ui.loading);

  return {
    pageLoading: loading,
    startPageLoad: () => dispatch(setLoading(true)),
    stopPageLoad: () => dispatch(setLoading(false)),
  };
}
