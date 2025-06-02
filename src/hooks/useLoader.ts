import { useAppDispatch } from '@src/redux/hook';
import { setLoading } from '@src/redux/reducers/uiSlice';

export function useLoader() {
  const dispatch = useAppDispatch();
  return {
    startPageLoad: () => dispatch(setLoading(true)),
    stopPageLoad: () => dispatch(setLoading(false)),
  };
}
