import { useDispatch } from 'react-redux';
import { setLoading } from '@src/redux/reducers/uiSlice';

export function useLoader() {
  const dispatch = useDispatch();
  return {
    startPageLoad: () => dispatch(setLoading(true)),
    stopPageLoad: () => dispatch(setLoading(false)),
  };
}
